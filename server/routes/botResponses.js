const express = require('express');
const router = express.Router();
const BotResponse = require('../models/BotResponse');

// Tạo phản hồi của bot mới
router.post('/', async (req, res) => {
    const botResponse = new BotResponse(req.body);
    try {
        const savedResponse = await botResponse.save();
        res.status(201).json(savedResponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Lấy phản hồi của bot tương ứng với câu hỏi người dùng (sử dụng để lấy botId)
router.get('/:question', async (req, res) => {
    try {
        // Lấy câu hỏi từ tham số URL
        const question = req.params.question;
        
        
        // Tìm phản hồi của bot phù hợp với câu hỏi
        const response = await BotResponse.findOne({ input: question }); // Tìm theo câu hỏi
        if (!response) {
            return res.status(404).json({ message: 'Câu trả lời không tìm thấy' });
        }
        
        // Trả về phản hồi từ bot
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
