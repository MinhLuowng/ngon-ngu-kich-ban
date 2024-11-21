const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Đường dẫn tới mô hình User
const jwt = require('jsonwebtoken');

// Mã hóa token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Thời gian hết hạn của token
    });
};

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        // Kiểm tra mật khẩu (không mã hóa, so sánh trực tiếp)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Tạo token
        const token = generateToken(user);
        
        // Trả về token và userId
        res.json({ token, userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Đăng ký
router.post('/register', async (req, res) => {
    const { username, email, password, gender } = req.body;

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Tạo một người dùng mới
        const newUser = new User({
            username,
            email,
            password,
            profile_picture: '/images/default.png', // Đường dẫn tới ảnh mặc định
            gender
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();

        // Tạo token
        const token = generateToken(newUser);

        // Trả về thông tin userId và token
        res.status(201).json({ token, userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
