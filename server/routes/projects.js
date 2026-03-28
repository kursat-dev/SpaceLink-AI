const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { auth, optionalAuth } = require('../middleware/auth');
const { escapeRegExp } = require('../utils/escapeRegex');
const { sendNotification } = require('../utils/notify');

// @route   GET /api/projects
// @desc    Get all projects
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { status, skill, search, owner, limit = 20, page = 1 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (skill) query.requiredSkills = { $in: [new RegExp(escapeRegExp(skill), 'i')] };
    if (owner) query.owner = owner;
    if (search) {
      const safeSearch = escapeRegExp(search);
      query.$or = [
        { title: new RegExp(safeSearch, 'i') },
        { description: new RegExp(safeSearch, 'i') }
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

    // Notify project owner about new applicant
    sendNotification(
      project.owner,
      'new_applicant',
      'New Application Received',
      `${req.user.name} applied to your project "${project.title}"`,
      { projectId: project._id.toString(), applicantId: req.user._id.toString() }
    ).catch(err => console.error('Apply notification error:', err));
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id/applicants/:applicantId
// @desc    Accept or reject an applicant
router.put('/:id/applicants/:applicantId', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only project owner or admin can manage applicants
    if (project.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applicant = project.applicants.find(
      a => a.user.toString() === req.params.applicantId
    );
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    applicant.status = status;

    // If accepted, add to team members
    if (status === 'accepted') {
      const alreadyInTeam = project.teamMembers.some(
        tm => tm.user.toString() === req.params.applicantId
      );
      if (!alreadyInTeam) {
        project.teamMembers.push({
          user: req.params.applicantId,
          role: 'Team Member'
        });
      }
    }

    await project.save();

    // Send notification to applicant
    const notifTitle = status === 'accepted'
      ? 'Application Accepted!'
      : 'Application Update';
    const notifBody = status === 'accepted'
      ? `Your application to "${project.title}" has been accepted! You are now a team member.`
      : `Your application to "${project.title}" was not selected at this time.`;

    const notifType = status === 'accepted' ? 'application_accepted' : 'application_rejected';

    sendNotification(
      req.params.applicantId,
      notifType,
      notifTitle,
      notifBody,
      { projectId: project._id.toString(), status }
    ).catch(err => console.error('Applicant notification error:', err));

    const populated = await Project.findById(project._id)
      .populate('owner', 'name role avatar title')
      .populate('teamMembers.user', 'name avatar title')
      .populate('applicants.user', 'name avatar title');

    res.json(populated);
  } catch (error) {
    console.error('Manage applicant error:', error);
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
