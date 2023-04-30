const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

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

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
