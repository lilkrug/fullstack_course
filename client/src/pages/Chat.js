import React, { useState, useEffect, useRef, useContext  } from 'react';
import io from 'socket.io-client';
import { AuthContext } from "../helpers/AuthContext";

const ENDPOINT = 'localhost:3001';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
    socketRef.current = io(ENDPOINT, {
      transports: ['websocket'],
      auth: { token }
    });

    socketRef.current.on('allMessages', (messages) => {
      console.log(token)
      setMessages(messages);
    });

    socketRef.current.on('newMessage', (message) => {
      console.log(token)
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    socketRef.current.emit('newMessage', { text: message,author:authState.username });
    setMessage('');
  };

  return (
    <div>
      <div style={{ height: '500px', overflowY: 'scroll' }}>
        {messages.map((message, index) => (
          <div key={index}>{message.author}:{message.text}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}


export default Chat;