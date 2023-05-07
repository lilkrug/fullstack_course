const express = require("express");
const router = express.Router();
const { Results } = require("../models");
const { Teams } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    const listOfResults = await Results.findAll({ include: [Teams] });
    res.json(listOfResults);
});

module.exports = router;
