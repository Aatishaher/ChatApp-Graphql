import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation, useSubscription } from '@apollo/client';

const GET_MESSAGES = gql`
  query MessagesbyUser($reciver: ID!, $sender: ID!) {
  messagesbyUser(reciver: $reciver, sender: $sender) {
    message
    reciver {
      id
    }
    sender {
      id
    }
  }
}
`;

const CREATE_MESSAGE = gql`
  mutation Mutation($reciver: ID!, $sender: ID!, $message: String!) {
  createMessage(reciver: $reciver, sender: $sender, message: $message) {
    message
  }
}
`;

const MESSAGE_SENT=gql`
  subscription MessageSent($reciver: ID!, $sender: ID!) {
  messageSent(reciver: $reciver, sender: $sender) {
    message
    sender {
      id
    }
  }
}
`

const UserChatWindow = ({ user,id }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { loading, error, data } = useQuery(GET_MESSAGES, {
    variables: { reciver: user.id,sender:id},
    skip: !user,
  });
  useEffect(() => {
    if (data && data.messagesbyUser) {
      const formatted = data.messagesbyUser.map((msg) => ({
        text: msg.message,
        sender: msg.sender.id,
      }));
      setMessages(formatted);
    }
  },[data]);

  const [createMessage] = useMutation(CREATE_MESSAGE,);
  const { data:subdata } = useSubscription(MESSAGE_SENT,{
    variables:{sender:id,reciver:user.id}
  });

  useEffect(() => {
    if (subdata?.messageSent) {
      console.log(subdata);
      const incoming = {
        text: subdata.messageSent.message,
        sender: subdata.messageSent.sender.id, 
      };
      setMessages((prev) => [...prev, incoming]);
      console.log(incoming);
    }
  }, [subdata]);
  
  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await createMessage({
          variables: {
            reciver: user.id,
            message: message,
            sender:id
          },
        });
      } catch (err) {
        console.error('Error sending message:', err);
      }
      setMessage('');
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f0f2f5' }}>
      {/* Header */}
      <div style={{
        padding: '10px 16px',
        backgroundColor: '#f0f2f5',
        borderBottom: '1px solid #e9edef',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
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
        }}>
          {user.name.charAt(0)}
        </div>
        <span style={{ fontSize: '16px', color: '#111b21' }}>{user.name}</span>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        backgroundColor: '#efeae2'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            marginBottom: '10px',
            textAlign: msg.sender === user.id  ? 'left' : 'right'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: msg.sender === 'You' ? '#dcf8c6' : '#fff',
              color: '#111b21',
              maxWidth: '70%',
              wordWrap: 'break-word'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{
        display: 'flex',
        padding: '10px',
        backgroundColor: '#f0f2f5',
        borderTop: '1px solid #e9edef'
      }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: '9px 12px',
            borderRadius: '8px',
            border: '1px solid #d1d7db',
            marginRight: '10px',
            fontSize: '15px'
          }}
        />
        <button
          type="submit"
          disabled={!message.trim()}
          style={{
            padding: '8px 24px',
            backgroundColor: '#00a884',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: message.trim() ? 'pointer' : 'default',
            opacity: message.trim() ? 1 : 0.6
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default UserChatWindow;
