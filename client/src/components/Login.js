import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Khởi tạo useNavigate

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/ChatBot');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId); // Lưu `userId` vào localStorage
            localStorage.setItem('username', response.data.username); // Lưu `username` vào localStorage
            navigate('/ChatBot');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-lg" style={{ width: '400px' }}>
                <div className="card-body">
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block w-100">Login</button>
                    </form>
                    <div className="text-center mt-3">
                        <p>Don't have an account?</p>
                        <button className="btn btn-secondary" onClick={handleRegister}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
