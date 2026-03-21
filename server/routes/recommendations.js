const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const { auth } = require('../middleware/auth');

// @route   GET /api/recommendations
// @desc    Get personalized recommendations for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const currentUser = req.user;

    // Recommend projects matching user skills
    const recommendedProjects = await Project.find({
      owner: { $ne: currentUser._id },
      status: 'active',
      $or: [
        { requiredSkills: { $in: currentUser.skills.map(s => new RegExp(s, 'i')) } },
        { tags: { $in: currentUser.interests.map(i => new RegExp(i, 'i')) } }
      ]
    })
      .populate('owner', 'name role avatar title')
      .limit(6)
      .sort({ createdAt: -1 });

    // Recommend people with similar skills or interests
    const recommendedPeople = await User.find({
      _id: { $ne: currentUser._id },
      $or: [
        { skills: { $in: currentUser.skills.map(s => new RegExp(s, 'i')) } },
        { interests: { $in: currentUser.interests.map(i => new RegExp(i, 'i')) } }
      ]
    })
      .select('-password')
      .limit(6)
      .sort({ createdAt: -1 });

    // Recommend companies (users with Company role)
    const recommendedCompanies = await User.find({
      _id: { $ne: currentUser._id },
      role: 'Company',
      $or: [
        { skills: { $in: currentUser.interests.map(i => new RegExp(i, 'i')) } },
        { interests: { $in: currentUser.skills.map(s => new RegExp(s, 'i')) } }
      ]
    })
      .select('-password')
      .limit(6)
      .sort({ createdAt: -1 });

    // Fallbacks: if no specific matches, return recent items
    let projects = recommendedProjects;
    if (projects.length === 0) {
      projects = await Project.find({ status: 'active', owner: { $ne: currentUser._id } })
        .populate('owner', 'name role avatar title')
        .limit(6)
        .sort({ createdAt: -1 });
    }

    let people = recommendedPeople;
    if (people.length === 0) {
      people = await User.find({ _id: { $ne: currentUser._id } })
        .select('-password')
        .limit(6)
        .sort({ createdAt: -1 });
    }

    let companies = recommendedCompanies;
    if (companies.length === 0) {
      companies = await User.find({ _id: { $ne: currentUser._id }, role: 'Company' })
        .select('-password')
        .limit(6)
        .sort({ createdAt: -1 });
    }

    res.json({
      projects,
      people,
      companies
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
