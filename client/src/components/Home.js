import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="text-center">
                <h1 className="display-4 mb-4">Welcome to the Chat Bot!</h1>
                <p className="lead mb-4">This is the home page for the chat bot application.</p>
                <Link to="/login" className="btn btn-primary btn-lg">
                    Go to Login
                </Link>
            </div>
        </div>
    );
};

export default Home;
