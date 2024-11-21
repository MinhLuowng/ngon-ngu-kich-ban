const mongoose = require('mongoose');
const readline = require('readline');
const BotResponse = require('./models/BotResponse'); // Đảm bảo đường dẫn đúng đến mô hình BotResponse

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/Chat-bot', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Hàm thêm dữ liệu phản hồi của bot
const addBotResponse = async (input, response) => {
    const newResponse = new BotResponse({ input, response });

    try {
        await newResponse.save();
        console.log('Bot response added successfully!');
    } catch (error) {
        console.error('Error adding bot response:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Tạo interface readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Nhập dữ liệu phản hồi từ người dùng
rl.question('Enter input for bot response: ', (input) => {
    rl.question('Enter response for bot: ', (response) => {
        addBotResponse(input, response);
        rl.close();
    });
});
