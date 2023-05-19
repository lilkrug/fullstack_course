import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import { AuthContext } from "../helpers/AuthContext";
import Swal from "sweetalert2";

const ENDPOINT = 'https://course-project-75u9.onrender.com';

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
      Swal.fire({
        icon: 'error',
        title: 'Ошибка',
        text: 'Вы не можете ввести пустую строку',
        confirmButtonColor: '#fe6401',
      })
      setMessage('');
    }
  };
  
  return (
    <div>
      <div className='Chat-page'>
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
        <button type="submit"> Отправить </button>
      </form>
    </div>
  );
}


export default Chat;