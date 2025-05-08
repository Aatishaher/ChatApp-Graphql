import React, { useState, useEffect } from 'react';
import SideBar from '../Components/SideBar';
import UserChatWindow from '../Components/UserChatWindow';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            try {
                const decode = jwtDecode(token);
                setUserId(decode.id);
            } catch (err) {
                console.error('Invalid token:', err);
                navigate('/login');
            }
        }
    }, [navigate]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    if (!userId) {
        return null; 
    }

    return (
        <div style={{
            display: 'flex',
            height: '80vh',
            width: '80vw',
            overflow: 'hidden',
            backgroundColor: '#f0f2f5'
        }}>
            <SideBar onUserSelect={handleUserSelect} id={userId} />
            <div style={{ flex: 1, display: 'flex' }}>
                {selectedUser ? (
                    <UserChatWindow user={selectedUser} id={userId} />
                ) : (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f8f9fa',
                        color: '#667781'
                    }}>
                        <p>Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
