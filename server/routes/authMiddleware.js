const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Token từ header Authorization

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin người dùng vào request
        next(); // Tiếp tục xử lý
    } catch (error) {
        res.status(401).json({ message: 'Invalid Token' });
    }
};

module.exports = authMiddleware;
