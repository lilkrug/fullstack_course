const express = require("express");
const router = express.Router();
const { validateToken } = require("../middlewares/AuthMiddleware");
const Players = require("../models").Players;
const FieldPositions = require("../models").FieldPositions;
const Teams = require("../models").Teams;

router.get("/", validateToken, async (req, res) => {
  const listOfPlayers = await Players.findAll();
  res.json({ listOfPlayers: listOfPlayers});
});

router.get("/byTeamId/:id",validateToken, async (req, res) => {
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

router.get("/byId/:id",validateToken, async (req, res) => {
  const id = req.params.id;
  //const player = await Players.findByPk(id);
  const player = await Players.findOne({
    where: {id: id},
    include: [FieldPositions]
  })
  res.json(player);
});

router.post("/", validateToken, async (req, res) => {
  const player = req.body;
  console.log(player)
  if(player.name!=null && player.teamId!=null && player.fieldPositionId!=null && player.fieldNumber!=null){
    const foundedPlayer = await Players.findOne({
      where: {
        name: player.name
      }
    })
    const isTeamExisting = await Teams.findOne({
        where:{
            id: player.teamId
        }
    })
    const isPositionExisting = await FieldPositions.findOne({
        where:{
            id: player.fieldPositionId
        }
    })
    console.log(isTeamExisting)
    if(foundedPlayer==null){
        if(isTeamExisting!=null){
            if(isPositionExisting!=null){
                await Players.create(player);
                res.json({
                    name: player.name,
                    teamId: player.teamId,
                    fieldNumber: player.fieldNumber,
                    fieldPosition: player.fieldPositionId
                });
            }
            else{
                res.json("Position doesn't exist");
            }
        }
        else{
            res.json("Team doesn't exist");
        }
    }
    else{
      res.json("Player is already created");
    }
  }
  else{
    res.json("Missed params");
  }
});

router.delete("/:teamId", validateToken, async (req, res) => {
  const playerId = req.params.playerId;
  await Players.destroy({
    where: {
      id: playerId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
