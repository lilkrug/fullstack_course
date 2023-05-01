import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const ENDPOINT = 'localhost:3001';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(ENDPOINT, {
      transports: ['websocket'],
    });

    socketRef.current.on('allMessages', (messages) => {
      setMessages(messages);
    });

    socketRef.current.on('newMessage', (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [messages]);

  useEffect(() => {
    // Scroll to the bottom of the messages on initial render and when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    await axios.post('http://localhost:3001/messages', {
      text: message,
    });
    setMessage('');
  };

  return (
    <div style={{ height: '500px', overflowY: 'scroll' }}>
      <div style={{ position: 'relative' }}>
        {messages.map((message) => (
          <div key={message.id}>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form style={{ position: 'fixed', bottom: 0 }} onSubmit={handleSubmit}>
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