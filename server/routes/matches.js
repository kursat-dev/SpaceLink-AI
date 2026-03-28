const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');
const { sendNotification } = require('../utils/notify');

/**
 * Jaccard Similarity: |A ∩ B| / |A ∪ B|
 * Returns value between 0 and 1
 */
function jaccardSimilarity(setA, setB) {
  const a = new Set(setA.map(s => s.toLowerCase().trim()));
  const b = new Set(setB.map(s => s.toLowerCase().trim()));

  if (a.size === 0 && b.size === 0) return 0;

  const intersection = new Set([...a].filter(x => b.has(x)));
  const union = new Set([...a, ...b]);

  return intersection.size / union.size;
}

const experienceWeights = {
  'Junior': 1,
  'Mid-Level': 2,
  'Senior': 3,
  'Lead': 4,
  'Executive': 5
};

/**
 * Calculate match score between user and target
 */
function calculateMatchScore(user, target, type = 'user') {
  const userSkills = user.skills || [];
  const targetSkills = type === 'user' ? (target.skills || []) : (target.requiredSkills || []);
  const userInterests = user.interests || [];
  const targetInterests = type === 'user' ? (target.interests || []) : (target.tags || []);

  const skillScore = jaccardSimilarity(userSkills, targetSkills);
  const interestScore = jaccardSimilarity(userInterests, targetInterests);

  let totalScore = 0;
  let breakdown = {
    skills: Math.round(skillScore * 100),
    interests: Math.round(interestScore * 100),
    experience: 0
  };

  if (type === 'user') {
    const uExp = experienceWeights[user.experienceLevel] || 2;
    const tExp = experienceWeights[target.experienceLevel] || 2;
    // Calculate experience similarity (0 to 1)
    const expDiff = Math.abs(uExp - tExp);
    const expScore = 1 - (expDiff / 4); // Max diff is 4 (5 - 1). If diff is 0 -> 1.
    breakdown.experience = Math.round(expScore * 100);

    totalScore = Math.round((skillScore * 0.6 + interestScore * 0.25 + expScore * 0.15) * 100);
  } else {
    // For projects there is no experience level, we adjust scaling slightly
    totalScore = Math.round((skillScore * 0.70 + interestScore * 0.30) * 100);
  }

  return { totalScore, breakdown };
}

/**
 * Generate a "Why this match?" explanation
 */
function generateMatchReason(userSkills, targetSkills, userInterests, targetInterests, targetName, lang = 'en') {
  const commonSkills = userSkills.filter(s =>
    targetSkills.some(t => t.toLowerCase() === s.toLowerCase())
  );
  const commonInterests = userInterests.filter(s =>
    targetInterests.some(t => t.toLowerCase() === s.toLowerCase())
  );

  let reason = '';
  if (lang === 'tr') {
    if (commonSkills.length > 0) {
      reason += `${commonSkills.slice(0, 3).join(', ')} alanlarında ortak uzmanlık. `;
    }
    if (commonInterests.length > 0) {
      reason += `${commonInterests.slice(0, 3).join(', ')} konularında ortak ilgi alanları. `;
    }
    if (!reason) {
      reason = `${targetName} adlı kullanıcının projesi/profili, gelişmiş işbirliği için benzersiz bir yetenek setiyle uzmanlığınızı tamamlıyor.`;
    }
  } else {
    if (commonSkills.length > 0) {
      reason += `Shared expertise in ${commonSkills.slice(0, 3).join(', ')}. `;
    }
    if (commonInterests.length > 0) {
      reason += `Aligned interests in ${commonInterests.slice(0, 3).join(', ')}. `;
    }
    if (!reason) {
      reason = `${targetName}'s profile complements your expertise with a unique skill set for cross-functional collaboration.`;
    }
  }
  return reason.trim();
}

// @route   GET /api/matches
// @desc    Get matches for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const { type = 'all', minScore = 0 } = req.query;
    const lang = req.lang || 'en';

    const results = { users: [], projects: [] };

    const skillRegexes = (currentUser.skills || []).map(s => new RegExp(`^${s}$`, 'i'));
    const interestRegexes = (currentUser.interests || []).map(i => new RegExp(`^${i}$`, 'i'));

    // Match with users
    if (type === 'all' || type === 'users') {
      let query = { _id: { $ne: currentUser._id } };
      
      if (skillRegexes.length > 0 || interestRegexes.length > 0) {
        query.$or = [];
        if (skillRegexes.length > 0) query.$or.push({ skills: { $in: skillRegexes } });
        if (interestRegexes.length > 0) query.$or.push({ interests: { $in: interestRegexes } });
      }

      const users = await User.find(query).select('-password').limit(100);

      const userMatches = users
        .map(user => {
          const matchData = calculateMatchScore(currentUser, user, 'user');
          const explanation = generateMatchReason(
            currentUser.skills || [], user.skills || [],
            currentUser.interests || [], user.interests || [],
            user.name,
            lang
          );
          return {
            user,
            totalScore: matchData.totalScore,
            breakdown: matchData.breakdown,
            explanation,
            // Maintained for frontend backwards compat
            score: matchData.totalScore,
            reason: explanation, 
            type: 'user'
          };
        })
        .filter(m => m.totalScore >= parseInt(minScore) && m.totalScore > 0)
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10);

      results.users = userMatches;
    }

    // Match with projects
    if (type === 'all' || type === 'projects') {
      let pQuery = {
        owner: { $ne: currentUser._id },
        status: 'active'
      };

      if (skillRegexes.length > 0 || interestRegexes.length > 0) {
        pQuery.$or = [];
        if (skillRegexes.length > 0) pQuery.$or.push({ requiredSkills: { $in: skillRegexes } });
        if (interestRegexes.length > 0) pQuery.$or.push({ tags: { $in: interestRegexes } });
      }

      const projects = await Project.find(pQuery)
        .populate('owner', 'name role avatar title')
        .populate('teamMembers.user', 'name avatar title')
        .limit(100);

      const projectMatches = projects
        .map(project => {
          const matchData = calculateMatchScore(currentUser, project, 'project');
          const explanation = generateMatchReason(
            currentUser.skills || [], project.requiredSkills || [],
            currentUser.interests || [], project.tags || [],
            project.title,
            lang
          );
          return {
            project,
            totalScore: matchData.totalScore,
            breakdown: matchData.breakdown,
            explanation,
            // Maintained for frontend backwards compat
            score: matchData.totalScore,
            reason: explanation,
            type: 'project'
          };
        })
        .filter(m => m.totalScore >= parseInt(minScore) && m.totalScore > 0)
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10);

      results.projects = projectMatches;
    }

    res.json(results);

    const highMatches = results.users.filter(m => m.totalScore >= 60);
    for (const match of highMatches) {
      sendNotification(
        match.user._id,
        'new_match',
        'New match found!',
        `${currentUser.name} is a ${match.totalScore}% match with you`,
        { userId: currentUser._id.toString(), score: match.totalScore }
      ).catch(err => console.error('Match bildirim hatasi:', err));
    }
  } catch (error) {
    console.error('Matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
