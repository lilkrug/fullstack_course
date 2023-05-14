const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const socketIo = require('socket.io');
const Message = require("../models").Message;
const Matches = require("../models").Matches;

const configureSocket = (io) => {
    io.on('connection', async (socket) => {
        const token = socket.handshake.auth.token;
        console.log('token')
        console.log(token)
        if (token != null) {
            // Отправляем все сохраненные сообщения при подключении нового пользователя
            const messages = await Message.findAll();
            socket.emit('allMessages', messages);

            socket.on('newMessage', async ({ author, text }) => {
                console.log(author)
                const message = await Message.create({ author, text });
                io.emit('newMessage', message);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);
            });
        }
    });
}


module.exports = configureSocket;