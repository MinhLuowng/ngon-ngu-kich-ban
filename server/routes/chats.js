const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const BotResponse = require('../models/BotResponse');

// API tạo cuộc trò chuyện mới
router.post('/start-chat', async (req, res) => {
    try {
        const chat = new Chat({ participants: req.body.participants });
        await chat.save();
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API gửi tin nhắn
router.post('/send-message', async (req, res) => {
    try {
        const { senderId, message } = req.body;

        // Tạo tin nhắn của người dùng
        const userMessage = new Message({ senderId, message });
        await userMessage.save();

        // Tìm phản hồi từ bot dựa trên tin nhắn
        const botResponse = await BotResponse.findOne({ input: message });
        let responseMessage;

        if (botResponse) {
            // Nếu tìm thấy phản hồi từ bot
            responseMessage = new Message({
                senderId: botResponse._id, // `botId` từ bảng `BotResponse`
                receiverId: senderId,
                message: botResponse.response,
            });
        } else {
            // Nếu không có phản hồi phù hợp
            responseMessage = new Message({
                senderId: null, // Sử dụng null hoặc botId mặc định
                receiverId: senderId,
                message: "Xin lỗi, tôi chưa hiểu câu hỏi của bạn.",
            });
        }

        await responseMessage.save();
        res.status(200).json([userMessage, responseMessage]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API lấy tất cả tin nhắn trong cuộc trò chuyện
router.get('/messages/:chatId', async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId }).populate('senderId receiverId');
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
