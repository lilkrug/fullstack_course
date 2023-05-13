import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from "../helpers/AuthContext";

const ENDPOINT = 'localhost:3001';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const messagesRef = useRef(null);
  const { authState } = useContext(AuthContext);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    scrollToBottom();
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
      scrollToBottom();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() !== '') {
      socketRef.current.emit('newMessage', { text: message, author: authState.username });
      scrollToBottom();
      setMessage('');
    } else {
      alert('u cant input 0')
      setMessage('');
    }
  };

  return (
    <div>
      <div style={{ height: '500px',width:'400px', overflowY: 'scroll' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ wordWrap: 'break-word',wordBreak: 'break-word',whiteSpace: 'pre-wrap' }}>
            {message.author}:{message.text}
          </div>
        ))}
        <div ref={messagesRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(event) => {
            const inputValue = event.target.value;
            if (inputValue.length <= 150) {
              setMessage(inputValue);
            }
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}


export default Chat;