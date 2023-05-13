const express = require("express");
const router = express.Router();
const { Results } = require("../models");
const { Teams } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    try {
    const listOfResults = await Results.findAll({ include: [Teams] });
    res.json(listOfResults);
    } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    }
    });

module.exports = router;
