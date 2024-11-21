const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Tạo tin nhắn mới
router.post('/', async (req, res) => {
    const { userId, messages } = req.body;

    if (!userId || !Array.isArray(messages) || messages.length === 0) {
        console.error('Invalid request:', req.body);
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        let chat = await Message.findOne({ userId });

        if (!chat) {
            chat = new Message({ userId, messages: [] });
        }

        chat.messages.push(...messages);
        const updatedChat = await chat.save();
        res.status(201).json(updatedChat);
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: error.message });
    }
});

  
// Lấy danh sách tin nhắn giữa người dùng và bot (theo senderId và receiverId)
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const chat = await Message.findOne({ userId });
  
      if (!chat) {
        return res.status(404).json({ message: 'No conversation found' });
      }
  
      res.json(chat.messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = router;
