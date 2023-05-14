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

router.delete("/:id", validateToken, async (req, res) => {
    const { id } = req.params;
    try {
      const result = await Results.findByPk(id);
      if (!result) {
        res.status(404).json({ error: "Result not found" });
      } else {
        await result.destroy();
        res.json({ message: "Result deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

router.put("/edit/:id", validateToken, async (req, res) => {
    const { id } = req.params;
    const { scored_goals, conceded_goals, points } = req.body;

    if (scored_goals === undefined && conceded_goals === undefined && points === undefined) {
        return res.status(400).json({ error: "Missing parameters" });
    }

    try {
        const result = await Results.findByPk(id, { include: [Teams] });

        if (!result) {
            return res.status(404).json({ error: "Result not found" });
        }

        if (scored_goals !== undefined) {
            if (scored_goals < 0 || isNaN(scored_goals)) {
                return res.status(400).json({ error: "Invalid value for scored goals" });
            }
            result.scored_goals = scored_goals;
        }

        if (conceded_goals !== undefined) {
            if (conceded_goals < 0 || isNaN(conceded_goals)) {
                return res.status(400).json({ error: "Invalid value for conceded goals" });
            }
            result.conceded_goals = conceded_goals;
        }

        if (points !== undefined) {
            if (points < 0 || isNaN(points)) {
                return res.status(400).json({ error: "Invalid value for points" });
            }
            result.points = points;
        }

        await result.save();

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;
