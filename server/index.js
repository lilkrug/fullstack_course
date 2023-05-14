const express = require("express");
const socketIo = require('socket.io');
const configureSocket = require('./controllers/Chat');
const Message = require("./models/").Message;
const { validateToken } = require("./middlewares/AuthMiddleware");
const cors = require("cors");

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(cors());

const db = require("./models");

configureSocket(io);

app.post('/messages',validateToken,async (req, res) => {
  const message = req.body;
  await Message.create(message)
  io.emit('newMessage', message);
  res.status(200).send();
});

const postController = require("./controllers/Posts");
app.use("/posts", postController);
const commentsController = require("./controllers/Comments");
app.use("/comments", commentsController);
const usersController = require("./controllers/Users");
app.use("/auth", usersController);
const likesController = require("./controllers/Likes");
app.use("/likes", likesController);
const teamsController = require("./controllers/Teams");
app.use("/teams", teamsController);
const playersController = require("./controllers/Players");
app.use("/players", playersController);
const fieldPositionsController = require("./controllers/FieldPositions");
app.use("/fieldPositions", fieldPositionsController);
const matchesController = require("./controllers/Matches");
app.use("/matches", matchesController);
const messageController = require("./controllers/Messages");
app.use("/messages", messageController);
const resultsController = require("./controllers/Results");
app.use("/results", resultsController);

db.sequelize.sync().then(() => {
  http.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
