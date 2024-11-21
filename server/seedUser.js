// seed.js
const mongoose = require('mongoose');
const User = require('./models/User'); // Điều chỉnh đường dẫn nếu cần
const readline = require('readline');

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/Chat-bot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  promptUser();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Thiết lập readline để nhập dữ liệu từ terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Hàm nhập người dùng
const promptUser = () => {
  rl.question('Enter username: ', (username) => {
    rl.question('Enter email: ', (email) => {
      rl.question('Enter password: ', (password) => {
        rl.question('Enter profile picture URL (optional): ', (profile_picture) => {
          rl.question('Enter gender (male, female, other): ', (gender) => {
            const user = new User({
              username,
              email,
              password,
              profile_picture,
              gender,
            });

            // Lưu người dùng vào database
            user.save()
              .then(() => {
                console.log('User saved:', user);
                rl.close();
                mongoose.connection.close(); // Đóng kết nối MongoDB
              })
              .catch(err => {
                console.error('Error saving user:', err.message);
                rl.close();
                mongoose.connection.close(); // Đóng kết nối MongoDB
              });
          });
        });
      });
    });
  });
};
