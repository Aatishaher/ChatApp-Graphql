import React, { useState } from 'react'
import SideBar from '../Components/SideBar'
import UserChatWindow from '../Components/UserChatWindow'
import { jwtDecode } from 'jwt-decode';
const Home = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const token=localStorage.getItem('token');
    const decode=jwtDecode(token);
    const id=decode.id;
    console.log(id);
    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    return (
        <div style={{
                display: 'flex',
                height: '80vh',
                width: '80vw',
                overflow: 'hidden',
                backgroundColor: '#f0f2f5'
        }}>
            <SideBar onUserSelect={handleUserSelect} id={id} />
            <div style={{ flex: 1, display: 'flex' }}>
                {selectedUser ? (
                    <UserChatWindow user={selectedUser} id={id} />
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
    )
}

export default Home
