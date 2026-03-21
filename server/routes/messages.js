const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { getIO } = require('../socket');
const { sendNotification } = require('../utils/notify');

// @route   GET /api/messages
// @desc    Get all conversations for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all unique conversations
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$content' },
          lastMessageAt: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$read', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { lastMessageAt: -1 } }
    ]);

    // Populate user details
    const conversations = await Promise.all(
      messages.map(async (msg) => {
        const user = await User.findById(msg._id).select('name avatar title role');
        return {
          user,
          lastMessage: msg.lastMessage,
          lastMessageAt: msg.lastMessageAt,
          unreadCount: msg.unreadCount
        };
      })
    );

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/messages/:userId
// @desc    Get messages with specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 })
      .limit(100);

    // Mark unread messages as read
    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/messages/:userId
// @desc    Send message to user
router.post('/:userId', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Check recipient exists
    const recipient = await User.findById(req.params.userId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: req.params.userId,
      content: content.trim()
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    try {
      const io = getIO();
      io.to(`user:${req.params.userId}`).emit('new_message', populated);
    } catch (err) {
      console.error('Socket emit hatasi:', err.message);
    }

    sendNotification(
      req.params.userId,
      'new_message',
      `${req.user.name} sent a message`,
      content.trim().substring(0, 100),
      { senderId: req.user._id, senderName: req.user.name }
    ).catch(err => console.error('Bildirim olusturma hatasi:', err));

    res.status(201).json(populated);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
