const express = require("express");
//const app = express();
//const http = require("http");
const socketIo = require('socket.io');
const configureSocket = require('./routes/Chat');
const Message = require("./models/").Message;
const { validateToken } = require("./middlewares/AuthMiddleware");
//const server = http.createServer(app);
const cors = require("cors");
//const io = socketIo(server)

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

// Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);
const teamsRouter = require("./routes/Teams");
app.use("/teams", teamsRouter);
const playersRouter = require("./routes/Players");
app.use("/players", playersRouter);
const fieldPositionsRouter = require("./routes/FieldPositions");
app.use("/fieldPositions", fieldPositionsRouter);
const matchesRouter = require("./routes/Matches");
app.use("/matches", matchesRouter);
const messageRouter = require("./routes/Messages");
app.use("/messages", messageRouter);
const resultsRouter = require("./routes/Results");
app.use("/results", resultsRouter);

db.sequelize.sync().then(() => {
  http.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
