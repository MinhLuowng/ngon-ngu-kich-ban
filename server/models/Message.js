const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID của người dùng
  messages: [
    {
      senderId: { type: String, required: true }, // ID người gửi
      receiverId: { type: String, required: true }, // ID người nhận
      message: { type: String, required: true }, // Nội dung tin nhắn
      createdAt: { type: Date, default: Date.now }, // Thời gian tin nhắn
    },
  ],
});

module.exports = mongoose.model('Message', messageSchema);
