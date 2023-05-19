const express = require("express");
const router = express.Router();
const { Message } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", async (req, res) => {
  const message = req.body;
  await Message.create(message)
  res.send('di nah')
});

module.exports = router;
