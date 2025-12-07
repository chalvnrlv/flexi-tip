const express = require('express');
const {
  getChats,
  getChat,
  createChat,
  getMessages,
  sendMessage,
  markAsRead,
  deleteMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getChats);
router.post('/', protect, createChat);
router.get('/:id', protect, getChat);
router.get('/:id/messages', protect, getMessages);
router.post('/:id/messages', protect, sendMessage);
router.put('/:id/read', protect, markAsRead);
router.delete('/:chatId/messages/:messageId', protect, deleteMessage);

module.exports = router;
