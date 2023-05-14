const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const Players = require("../models").Players;
const FieldPositions = require("../models").FieldPositions;
const Teams = require("../models").Teams;
const isAdmin = require("../middlewares/isAdmin");

router.get("/", validateToken, async (req, res) => {
  try {
    const listOfPlayers = await Players.findAll({
      include: [FieldPositions, Teams],
    });
    res.json({ listOfPlayers });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get players by team id
router.get("/byTeamId/:id", validateToken, async (req, res) => {
  const teamId = req.params.id;
  try {
    const listOfPlayers = await Players.findAll({
      where: {
        teamId: teamId,
      },
      include: [FieldPositions],
    });
    console.log(listOfPlayers);
    res.json(listOfPlayers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get player by id
router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const player = await Players.findOne({
      where: { id: id },
      include: [FieldPositions, Teams],
    });
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update player
router.put("/:playerId", validateToken, isAdmin, async (req, res) => {
  const playerId = req.params.playerId;
  const player = req.body;
  if (playerId != null && player.goals != null && player.assists != null) {
    try {
      const isPlayerExisting = await Players.findOne({
        where: {
          id: playerId,
        },
      });
      if (isPlayerExisting != null) {
        await Players.update(
          {
            goals: isPlayerExisting.goals + parseInt(player.goals),
            assists: isPlayerExisting.assists + parseInt(player.assists),
          },
          {
            where: { id: isPlayerExisting.id },
          }
        );
        res.json("Player updated successfully");
      } else {
        res.status(404).json({ error: "Player not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(400).json({ error: "Missing parameters" });
  }
});

router.put("/edit/:id", validateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const updatedPlayer = req.body;

  if (
    updatedPlayer.name == null ||
    updatedPlayer.teamId == null ||
    updatedPlayer.fieldPositionId == null ||
    updatedPlayer.goals < 0 ||
    updatedPlayer.assists < 0
  ) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  try {
    const player = await Players.findByPk(id);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    const existingPlayer = await Players.findOne({
      where: { name: updatedPlayer.name },
    });

    if (existingPlayer && existingPlayer.id !== player.id) {
      return res.status(409).json({ error: "Player name is already taken" });
    }

    const isTeamExisting = await Teams.findOne({
      where: {
        id: updatedPlayer.teamId,
      },
    });

    if (!isTeamExisting) {
      return res.status(404).json({ error: "Team doesn't exist" });
    }

    const isPositionExisting = await FieldPositions.findOne({
      where: {
        id: updatedPlayer.fieldPositionId,
      },
    });

    if (!isPositionExisting) {
      return res.status(404).json({ error: "Position doesn't exist" });
    }

    player.name = updatedPlayer.name;
    player.teamId = updatedPlayer.teamId;
    player.fieldPositionId = updatedPlayer.fieldPositionId;
    player.goals = updatedPlayer.goals;
    player.assists = updatedPlayer.assists;

    await player.save();

    res.json({
      name: player.name,
      teamId: player.teamId,
      fieldPosition: player.fieldPositionId,
      goals: player.goals,
      assists: player.assists,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create player
router.post("/", validateToken, isAdmin, async (req, res) => {
  const player = req.body;
  if (
    player.name != null &&
    player.teamId != null &&
    player.fieldPositionId != null
  ) {
    try {
      const foundedPlayer = await Players.findOne({
        where: {
          name: player.name,
        },
      });
      const isTeamExisting = await Teams.findOne({
        where: {
          id: player.teamId,
        },
      });
      const isPositionExisting = await FieldPositions.findOne({
        where: {
          id: player.fieldPositionId,
        },
      });
      if (foundedPlayer == null) {
        if (isTeamExisting != null) {
          if (isPositionExisting != null) {
            await Players.create(player);
            res.json({
              name: player.name,
              teamId: player.teamId,
              fieldPosition: player.fieldPositionId,
            });
          } else {
            res.status(404).json({ error: "Position doesn't exist" });
          }
        } else {
          res.status(404).json({ error: "Team doesn't exist" });
        }
      } else {
        res.status(409).json({ error: "Player already exists" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(400).json({ error: "Missing parameters" });
  }
});

router.delete("/:playerId", validateToken, isAdmin, async (req, res) => {
  const playerId = req.params.playerId;
  await Players.destroy({
    where: {
      id: playerId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
