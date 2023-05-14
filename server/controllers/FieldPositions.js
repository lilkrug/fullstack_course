const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const FieldPositions = require("../models").FieldPositions;

router.get("/", validateToken, async (req, res) => {
  const listOfPositions = await FieldPositions.findAll();
  res.json({ listOfPositions: listOfPositions});
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const position = await FieldPositions.findByPk(id);
  res.json(position);
});

module.exports = router;
