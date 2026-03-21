const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { auth, optionalAuth } = require('../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { status, skill, search, owner, limit = 20, page = 1 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (skill) query.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    if (owner) query.owner = owner;
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const projects = await Project.find(query)
      .populate('owner', 'name role avatar title')
      .populate('teamMembers.user', 'name avatar title')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name role avatar title email')
      .populate('teamMembers.user', 'name avatar title')
      .populate('applicants.user', 'name avatar title');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create a project
router.post('/', auth, async (req, res) => {
  try {
    const {
      title, description, requiredSkills, budget,
      duration, location, objectives, tags, coverImage
    } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      requiredSkills: requiredSkills || [],
      budget: budget || '',
      duration: duration || '',
      location: location || 'Remote',
      objectives: objectives || [],
      tags: tags || [],
      coverImage: coverImage || '',
      teamMembers: [{ user: req.user._id, role: 'Owner' }]
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name role avatar title')
      .populate('teamMembers.user', 'name avatar title');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const allowedFields = [
      'title', 'description', 'requiredSkills', 'status',
      'budget', 'duration', 'location', 'objectives', 'tags', 'coverImage'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('owner', 'name role avatar title')
      .populate('teamMembers.user', 'name avatar title');

    res.json(updated);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects/:id/apply
// @desc    Apply to a project
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if already applied
    const alreadyApplied = project.applicants.find(
      a => a.user.toString() === req.user._id.toString()
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied to this project' });
    }

    // Check if owner
    if (project.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot apply to your own project' });
    }

    project.applicants.push({
      user: req.user._id,
      message: req.body.message || '',
      status: 'pending'
    });

    await project.save();

    const populated = await Project.findById(project._id)
      .populate('owner', 'name role avatar title')
      .populate('teamMembers.user', 'name avatar title')
      .populate('applicants.user', 'name avatar title');

    res.json(populated);
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
