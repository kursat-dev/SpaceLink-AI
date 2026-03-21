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

/**
 * Calculate match score between two entities.
 * Weighs: skills (60%) + interests (40%)
 */
function calculateMatchScore(userSkills, userInterests, targetSkills, targetInterests) {
  const skillScore = jaccardSimilarity(userSkills || [], targetSkills || []);
  const interestScore = jaccardSimilarity(userInterests || [], targetInterests || []);

  const weightedScore = (skillScore * 0.6) + (interestScore * 0.4);
  return Math.round(weightedScore * 100);
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

    // Match with users
    if (type === 'all' || type === 'users') {
      const users = await User.find({
        _id: { $ne: currentUser._id }
      }).select('-password').limit(50);

      const userMatches = users
        .map(user => {
          const score = calculateMatchScore(
            currentUser.skills, currentUser.interests,
            user.skills, user.interests
          );
          const reason = generateMatchReason(
            currentUser.skills, user.skills,
            currentUser.interests, user.interests,
            user.name,
            lang
          );
          return {
            user,
            score,
            reason,
            type: 'user'
          };
        })
        .filter(m => m.score >= parseInt(minScore))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      results.users = userMatches;
    }

    // Match with projects
    if (type === 'all' || type === 'projects') {
      const projects = await Project.find({
        owner: { $ne: currentUser._id },
        status: 'active'
      })
        .populate('owner', 'name role avatar title')
        .populate('teamMembers.user', 'name avatar title')
        .limit(50);

      const projectMatches = projects
        .map(project => {
          const score = calculateMatchScore(
            currentUser.skills, currentUser.interests,
            project.requiredSkills, project.tags || []
          );
          const reason = generateMatchReason(
            currentUser.skills, project.requiredSkills,
            currentUser.interests, project.tags || [],
            project.title,
            lang
          );
          return {
            project,
            score,
            reason,
            type: 'project'
          };
        })
        .filter(m => m.score >= parseInt(minScore))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      results.projects = projectMatches;
    }

    res.json(results);

    const highMatches = results.users.filter(m => m.score >= 60);
    for (const match of highMatches) {
      sendNotification(
        match.user._id,
        'new_match',
        'New match found!',
        `${currentUser.name} is a ${match.score}% match with you`,
        { userId: currentUser._id.toString(), score: match.score }
      ).catch(err => console.error('Match bildirim hatasi:', err));
    }
  } catch (error) {
    console.error('Matches error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
