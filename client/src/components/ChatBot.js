import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [botId, setBotId] = useState('botId'); // Lưu botId
    const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
    const username = localStorage.getItem('username'); // Lấy username từ localStorage
    const profilePicture = localStorage.getItem('profilePicture'); // Lấy ảnh đại diện từ localStorage
    const navigate = useNavigate(); // Khởi tạo useNavigate

    useEffect(() => {
        const fetchMessages = async () => {
            if (!userId) return; // Kiểm tra userId trước khi gửi request
    
            try {
                const response = await axios.get(`http://localhost:5000/api/messages/${userId}`);
                
                // Kiểm tra dữ liệu trả về
                if (Array.isArray(response.data)) {
                    setMessages(response.data); // Gán tin nhắn nếu dữ liệu là mảng
                } else {
                    console.error("Unexpected response format", response.data);
                }
            } catch (error) {
                console.error("Error fetching messages:", error.response?.data?.message || error.message);
            }
        };
    
        fetchMessages();
    }, [userId]);
    

    const sendMessage = async () => {
        if (!inputMessage.trim() || !userId) return; // Kiểm tra input message không rỗng
        
        try {
            // Lấy phản hồi từ bot
            const response = await axios.get(`http://localhost:5000/api/botresponses/${encodeURIComponent(inputMessage)}`);
            const botResponse = response.data?.response || "Tôi không biết câu trả lời cho câu hỏi này.";
        
            // Tạo mảng tin nhắn
            const newMessages = [
                { senderId: userId, receiverId: botId, message: inputMessage },
                { senderId: botId, receiverId: userId, message: botResponse }
            ];
        
            // Cập nhật giao diện trước
            setMessages(prev => [...prev, ...newMessages]);
        
            // Gửi đoạn hội thoại đến API (backend yêu cầu chuẩn)
            await axios.post('http://localhost:5000/api/messages', {
                userId,
                messages: newMessages
            });
        
            setInputMessage(''); // Xóa input sau khi gửi
        } catch (error) {
            console.error("Error sending message:", error.response?.data?.message || error.message);
        }
    };
    
    

    const handleLogout = () => {
        // Xóa token và userId khỏi localStorage và chuyển hướng về trang đăng nhập
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('profilePicture');
        navigate('/login');
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mt-4">
                <div>
                    <img src={profilePicture || '/images/default.png'} alt="Profile" style={{ width: '40px', borderRadius: '50%' }} />
                    <span className="ml-2">{username}</span>
                </div>
                <button className="btn btn-danger" onClick={handleLogout}>Đăng xuất</button>
            </div>
            <h2 className="text-center mt-4">Chat Bot</h2>

            {/* Phần hiển thị tin nhắn */}
            <div className="chat-box bg-light p-4 mb-4" style={{ height: '300px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-3 ${msg.senderId === userId ? 'text-right' : 'text-left'}`}>
                        <div className={`p-2 rounded ${msg.senderId === userId ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                            {msg.message}
                        </div>
                    </div>
                ))}
            </div>

            {/* Phần nhập câu hỏi và nút gửi */}
            <div className="d-flex justify-content-center align-items-center">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="form-control mr-2"
                    style={{ width: '80%' }}
                    placeholder="Nhập câu hỏi..."
                />
                <button onClick={sendMessage} className="btn btn-primary">Gửi</button>
            </div>
        </div>
    );
};

export default ChatBot;
