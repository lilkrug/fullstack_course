const express = require("express");
const app = express();
const http = require("http");
const Message = require("./models/").Message;
const server = http.createServer(app);
const cors = require("cors");
const WebSocket = require("ws");

app.use(express.json());
app.use(cors());
const wss = new WebSocket.Server({ server });
const db = require("./models");

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
const matchesRouter = require("./routes/matches");
app.use("/matches", matchesRouter);

wss.on("connection", (ws) => {
  console.log("WebSocket connected");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    Message.create({ text: message }).then(() => {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  });
});

db.sequelize.sync().then(() => {
  server.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
