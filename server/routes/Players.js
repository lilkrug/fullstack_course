const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const Players = require("../models").Players;
const FieldPositions = require("../models").FieldPositions;
const Teams = require("../models").Teams;
const isAdmin = require("../middlewares/isAdmin");

router.get("/", validateToken, async (req, res) => {
  const listOfPlayers = await Players.findAll({
    include: [FieldPositions, Teams]
  });
  res.json({ listOfPlayers: listOfPlayers });
});

router.get("/byTeamId/:id", validateToken, async (req, res) => {
  const teamId = req.params.id;
  const listOfPlayers = await Players.findAll({
    where: {
      teamId: teamId
    },
    include: [FieldPositions]
  });
  console.log(listOfPlayers)
  res.json(listOfPlayers);
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  //const player = await Players.findByPk(id);
  const player = await Players.findOne({
    where: { id: id },
    include: [FieldPositions,Teams]
  })
  res.json(player);
});

router.put("/:playerId", validateToken, isAdmin, async (req, res) => {
  const playerId = req.params.playerId;
  const player = req.body;
  if (playerId != null && player.goals != null && player.assists != null) {
    const isPlayerExisting = await Players.findOne({
      where: {
        id: playerId
      }
    })
    if (isPlayerExisting != null) {
      console.log('updateeee')
      await Players.update(
        {
          goals: isPlayerExisting.goals + parseInt(player.goals),
          assists: isPlayerExisting.assists + parseInt(player.assists),
        },
        {
          where: { id: isPlayerExisting.id }
        }
      )
      res.json("Player updated successfully");
    }
    else {
      res.json("Problem");
    }
  }
  else {
    res.json("Missed params");
  }
});

router.post("/", validateToken, isAdmin, async (req, res) => {
  const player = req.body;
  console.log(player)
  if (player.name != null && player.teamId != null && player.fieldPositionId != null ) {
    const foundedPlayer = await Players.findOne({
      where: {
        name: player.name
      }
    })
    const isTeamExisting = await Teams.findOne({
      where: {
        id: player.teamId
      }
    })
    const isPositionExisting = await FieldPositions.findOne({
      where: {
        id: player.fieldPositionId
      }
    })
    console.log(isTeamExisting)
    if (foundedPlayer == null) {
      if (isTeamExisting != null) {
        if (isPositionExisting != null) {
          await Players.create(player);
          res.json({
            name: player.name,
            teamId: player.teamId,
            fieldPosition: player.fieldPositionId
          });
        }
        else {
          res.json("Position doesn't exist");
        }
      }
      else {
        res.json("Team doesn't exist");
      }
    }
    else {
      res.json("Player is already created");
    }
  }
  else {
    res.json("Missed params");
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
