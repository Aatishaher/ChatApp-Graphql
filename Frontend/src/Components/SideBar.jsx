import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
query Query($sender: ID!) {
  users(sender: $sender) {
    name
    id
  }
}
`;

const SideBar = ({ onUserSelect,id }) => { 
  const [users, setUsers] = useState([]);

  const { loading, error, data } = useQuery(GET_USERS,{
    variables:{sender:id}
  });

  useEffect(() => {
    if (data) {
      setUsers(data.users);
    } else if (error) {
      console.error("Error fetching users:", error);
    }
  },);

  return (
    <div
      className="sidebar"
      style={{
        width: '350px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #d1d7db',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      <h2
        className="sidebar-title"
        style={{
          fontSize: '20px',
          padding: '15px',
          margin: 0,
          backgroundColor: '#f0f2f5',
          color: '#41525d'
        }}
      >
        Chats
      </h2>
      <ul
        className="user-list"
        style={{
          listStyleType: 'none',
          padding: '0',
          margin: 0
        }}
      >
        {users.map((user) => (
          <li
            key={user.id}
            className="user-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 15px',
              cursor: 'pointer',
              borderBottom: '1px solid #e9edef',
              transition: 'background-color 0.3s'
            }}
            onClick={() => onUserSelect(user)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#f0f2f5')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <div
              className="user-avatar"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#00a884',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              {user.name.charAt(0)}
            </div>
            <span
              className="user-name"
              style={{
                fontSize: '16px',
                color: '#111b21',
              }}
            >
              {user.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
