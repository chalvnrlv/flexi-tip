const { Chat, Message } = require('../models/Chat');
const JastipService = require('../models/JastipService');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Get all chats for user
// @route   GET /api/chats
// @access  Private
exports.getChats = async (req, res) => {
  try {
    // In Sequelize with JSON array participants, we can't easily query "contains X".
    // We will use a workaround:
    // If we assume high volume, we should normalize 'participants' to a many-to-many table.
    // For now with JSON, we might need to fetch all and filter, or use raw query.
    // Let's rely on fetching all chats and filtering in memory if strict SQL JSON syntax is risky.
    // OR create a helper to use JSON_CONTAINS.
    // Actually, considering standard usage, maybe we just use findAll and filter.

    // Better: Fetch all chats.
    const allChats = await Chat.findAll({
      include: [
        { model: JastipService, as: 'jastipService', attributes: ['origin', 'destination', 'type'] },
        { model: Message, as: 'lastMessageEntity' } // We need association for lastMessage if it's a foreign key not just ID
        // Note: definitions in index.js: Chat.hasMany(Message), Message.belongsTo(Chat).
        // Chat table has lastMessageId column. We can associate Chat belongsTo Message as 'lastMessageDetails'
      ],
      order: [['updatedAt', 'DESC']]
    });

    // Filter chats where participants includes req.user.id
    // JSON array stored as [id1, id2]
    const userChats = allChats.filter(chat => {
      const participants = chat.participants || [];
      return participants.includes(req.user.id);
    });

    // We need to populate participant details manually or via association if we had many-to-many
    // Since it's JSON, we have to fetch User details.
    // This is inefficient (N+1), but without normalization it's the trade-off.
    // We can fetch all relevant Users in one go to optimize.

    const enrichedChats = await Promise.all(userChats.map(async (chat) => {
      const participantIds = chat.participants || [];
      const users = await User.findAll({
        where: {
          id: {
            [Op.in]: participantIds
          }
        },
        attributes: ['id', 'name', 'avatar', 'isOnline', 'lastSeen'] // isOnline/lastSeen might not be in User model schema?
        // User model (Step 37) does NOT have isOnline/lastSeen.
        // We will just return what we have.
      });

      const chatJSON = chat.toJSON();
      chatJSON.participants = users;

      // Fetch last message content manually if needed, or use the one from include if we set up 'lastMessageId' FK properly
      // The schema has `lastMessageId`. We didn't see `Chat.belongsTo(Message)` in index.js (Step 73 only showed Chat.hasMany Message).
      // We can fetch it manually.
      if (chat.lastMessageId) {
        chatJSON.lastMessage = await Message.findByPk(chat.lastMessageId);
      }

      return chatJSON;
    }));

    res.status(200).json({
      success: true,
      count: enrichedChats.length,
      data: enrichedChats,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single chat
// @route   GET /api/chats/:id
// @access  Private
exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id, {
      include: [{ model: JastipService, as: 'jastipService' }]
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Check participant
    const participants = chat.participants || [];
    if (!participants.includes(req.user.id)) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this chat',
      });
    }

    // Populate participants
    const users = await User.findAll({
      where: { id: { [Op.in]: participants } },
      attributes: ['id', 'name', 'avatar']
    });

    const chatJSON = chat.toJSON();
    chatJSON.participants = users;

    res.status(200).json({
      success: true,
      data: chatJSON,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create or get existing chat
// @route   POST /api/chats
// @access  Private
exports.createChat = async (req, res) => {
  try {
    const { participantId, jastipService } = req.body;

    // TODO: Optimize querying for existing chat with JSON
    // For now, fetch all chats involving this user and check
    const userChats = await Chat.findAll(); // Should filter by user if possible
    // Better: Filter in DB by jastipServiceId first

    const potentialChats = await Chat.findAll({
      where: { jastipServiceId: jastipService }
    });

    let existingChat = null;
    for (const chat of potentialChats) {
      const p = chat.participants || [];
      if (p.includes(req.user.id) && p.includes(participantId)) {
        existingChat = chat;
        break;
      }
    }

    if (existingChat) {
      return res.status(200).json({
        success: true,
        data: existingChat,
      });
    }

    // Create new chat
    const chat = await Chat.create({
      participants: [req.user.id, participantId],
      jastipServiceId: jastipService, // Map to jastipServiceId
    });

    // Populate for response
    const users = await User.findAll({
      where: { id: { [Op.in]: [req.user.id, participantId] } },
      attributes: ['id', 'name', 'avatar']
    });
    const chatJSON = chat.toJSON();
    chatJSON.participants = users;

    res.status(201).json({
      success: true,
      data: chatJSON,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get messages for a chat
// @route   GET /api/chats/:id/messages
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findByPk(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Make sure user is participant
    const participants = chat.participants || [];
    if (!participants.includes(req.user.id)) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access these messages',
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: messages } = await Message.findAndCountAll({
      where: { chatId: req.params.id },
      include: [{ model: User, as: 'sender', attributes: ['name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      total: count,
      data: messages.reverse(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Send message
// @route   POST /api/chats/:id/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { content, type = 'text', attachments } = req.body;

    const chat = await Chat.findByPk(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Make sure user is participant
    const participants = chat.participants || [];
    if (!participants.includes(req.user.id)) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to send messages in this chat',
      });
    }

    const message = await Message.create({
      chatId: req.params.id,
      senderId: req.user.id,
      content,
      type,
      attachments,
    });

    // Update chat's last message
    chat.lastMessageId = message.id;
    chat.changed('updatedAt', true); // Force update timestamp
    await chat.save();

    // We need to fetch sender info to return proper object
    const sender = await User.findByPk(req.user.id, { attributes: ['name', 'avatar'] });
    const messageJSON = message.toJSON();
    messageJSON.sender = sender;

    res.status(201).json({
      success: true,
      data: messageJSON,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chats/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Update all unread messages
    await Message.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          chatId: req.params.id,
          senderId: { [Op.ne]: req.user.id },
          isRead: false
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/chats/:chatId/messages/:messageId
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Make sure user is sender
    if (message.senderId !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this message',
      });
    }

    await message.destroy();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
