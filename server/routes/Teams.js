const express = require("express");
const router = express.Router();
const fs = require('fs');
const { Op } = require('sequelize');
const Teams = require("../models").Teams;
const Players = require("../models").Players;
const Matches = require("../models").Matches;
const Results = require("../models").Results;
const Users = require("../models").Users;
const sharp = require('sharp');
const { validateToken } = require("../middlewares/AuthMiddleware");
const isAdmin = require("../middlewares/isAdmin");

router.get("/", validateToken, async (req, res) => {
  try {
    const listOfTeams = await Teams.findAll();
    res.json({ listOfTeams: listOfTeams });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/teams", validateToken, async (req, res) => {
  try {
    const listOfTeams = await Teams.findAll();
    res.json(listOfTeams);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/byId/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const team = await Teams.findByPk(id);
    if (!team) {
      res.status(404).json({ error: "Team not found" });
    } else {
      res.json(team);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/setfavoriteteam", validateToken, async (req, res) => {
  try {
    const userId = req.body.userId;
    await Users.update(
      { favoriteTeamId: req.body.favoriteTeamId },
      { where: { id: userId } }
    );
    res.json({ message: "Favorite team updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getfavoriteteam/:id", validateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await Users.findOne({
      where: { id: userId },
      include: { model: Teams }
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      const teamName = user.Team ? user.Team.name : null; // Название команды
      res.json(teamName);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bestScorerByTeamId/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const bestScorer = await Players.findOne({
      where: { teamId: id },
      order: [['goals', 'DESC']]
    });
    res.json(bestScorer);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bestAssistantByTeamId/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const bestAssistant = await Players.findOne({
      where: { teamId: id },
      order: [['assists', 'DESC']]
    });
    res.json(bestAssistant);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/byPlayerId/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const team = await Teams.findOne({
      where: { PlayerId: id },
    });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/", validateToken, isAdmin, async (req, res) => {
  try {
    const team = req.body;
    if (team.name != null) {
      const foundedTeam = await Teams.findOne({
        where: {
          name: team.name
        }
      });
      if (foundedTeam == null) {
        const createdTeam = await Teams.create(team);
        await Results.create({
          scored_goals: 0,
          conceded_goals: 0,
          points: 0,
          team_id: createdTeam.id
        });
        res.json({
          name: team.name
        });
      } else {
        res.status(409).json({ error: "Team is already created" });
      }
    } else {
      res.status(400).json({ error: "Missed params" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", validateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing params" });
    }

    const team = await Teams.findByPk(id);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const existingTeam = await Teams.findOne({
      where: { name },
    });

    if (existingTeam && existingTeam.id !== team.id) {
      return res.status(409).json({ error: "Team name is already taken" });
    }

    team.name = name;
    await team.save();

    res.json({ name: team.name });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:teamId", validateToken, isAdmin, async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const team = await Teams.findOne({
      where: { id: teamId },
      include: [Players]
    });
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    await Players.destroy({
      where: {
        teamId: teamId,
      },
    });
    await Results.destroy({
      where: {
        team_id: teamId,
      },
    });
    await Matches.destroy({
      where: {
        [Op.or]: [
          { firstTeamId: teamId },
          { secondTeamId: teamId }
        ]
      },
    });
    await Teams.destroy({
      where: {
        id: teamId,
      },
    });

    res.json("Deleted successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
