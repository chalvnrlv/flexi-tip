const { Chat, Message } = require('../models/Chat');
const User = require('../models/User');
const { Op } = require('sequelize');

// Hardcoded Assistant Email from Seed
const ASSISTANT_EMAIL = 'assistant@flexitip.com';

const getAssistantUser = async () => {
    return await User.findOne({ where: { email: ASSISTANT_EMAIL } });
};

// @desc    Chat with Assistant
// @route   POST /api/assistant/chat
// @access  Private
exports.chatWithAssistant = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        const assistant = await getAssistantUser();
        if (!assistant) {
            return res.status(500).json({ success: false, message: 'Assistant service unavailable' });
        }

        // 1. Find or Create Chat with Assistant
        // We need to look for a chat where participants are ONLY [userId, assistantId]
        // Since participants is JSON [id1, id2], we check if it contains both.

        // Simplification: We fetch all chats for user and find the one with assistant.
        const allChats = await Chat.findAll();
        let chat = null;

        for (const c of allChats) {
            const p = c.participants || [];
            if (p.includes(userId) && p.includes(assistant.id)) {
                chat = c;
                break;
            }
        }

        if (!chat) {
            chat = await Chat.create({
                participants: [userId, assistant.id],
                // jastipServiceId: null // General chat
            });
        }

        // 2. Save User Message
        const userMsg = await Message.create({
            chatId: chat.id,
            senderId: userId,
            content: message,
            type: 'text'
        });

        // 3. Generate Assistant Response
        let replyContent = "I'm sorry, I didn't understand that.";
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            replyContent = "Hello! I'm Flexi-Tip Assistant. How can I help you check on your orders or find a Jastiper today?";
        } else if (lowerMsg.includes('order') || lowerMsg.includes('status')) {
            replyContent = "You can check your order status in the 'My Orders' section of your profile.";
        } else if (lowerMsg.includes('jastip') || lowerMsg.includes('trip')) {
            replyContent = "We have many travelers going to Japan and Singapore this week! Check the Home page for featured trips.";
        } else if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
            replyContent = "Prices are set by the Jastiper and include product cost + shipping + service fee.";
        } else if (lowerMsg.includes('thank')) {
            replyContent = "You're welcome! Happy shopping!";
        }

        // 4. Save Assistant Response
        const assistantMsg = await Message.create({
            chatId: chat.id,
            senderId: assistant.id,
            content: replyContent,
            type: 'text'
        });

        // Update Chat last message
        chat.lastMessageId = assistantMsg.id;
        chat.changed('updatedAt', true);
        await chat.save();

        // 5. Return both messages or just the reply
        const responseData = assistantMsg.toJSON();
        responseData.sender = {
            id: assistant.id,
            name: assistant.name,
            avatar: assistant.avatar
        };

        res.status(200).json({
            success: true,
            data: responseData,
            chatId: chat.id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
