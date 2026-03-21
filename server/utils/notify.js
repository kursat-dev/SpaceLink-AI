const Notification = require('../models/Notification');
const { getIO } = require('../socket');

async function sendNotification(recipientId, type, title, body, data = {}) {
  const notification = await Notification.create({
    recipient: recipientId,
    type,
    title,
    body,
    data
  });

  try {
    const io = getIO();
    io.to(`user:${recipientId.toString()}`).emit('notification', {
      _id: notification._id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      read: notification.read,
      createdAt: notification.createdAt
    });
  } catch (err) {
    console.error('Socket emit hatasi:', err.message);
  }

  return notification;
}

module.exports = { sendNotification };
