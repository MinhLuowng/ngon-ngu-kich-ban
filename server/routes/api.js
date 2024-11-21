const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');

var usersRouter = require('./users');
var chatsRouter = require('./chats');
var botResponsesRouter = require('./botResponses');
var messagesRouter = require('./messages');

router.get('/protected-route', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route.', user: req.user });
});

router.use('/users', usersRouter);
router.use('/chats', chatsRouter);
router.use('/botResponses', botResponsesRouter);
router.use('/messages', messagesRouter);

module.exports = router;
