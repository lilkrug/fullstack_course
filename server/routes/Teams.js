const express = require("express");
const router = express.Router();
const fs = require('fs');
const Teams = require("../models").Teams;
const Players = require("../models").Players;
const sharp = require('sharp');
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfTeams = await Teams.findAll();
  // const imagePaths = listOfTeams.map(team => team.imagePath);
  // const imagePaths1 = listOfTeams.forEach(obj=>{
  //   const imagePath = obj.imagePath
  //   const image = fs.readFileSync(imagePath)
  //   sharp(image).resize({ width: 100 }).toBuffer()
  // })
  // const resizedImages = await sharp(image).resize({ width: 100 }).toBuffer();
  const image = fs.readFileSync('./images/smile.jpg')
  const resizedImage = await sharp(image).resize({ width: 100 }).toBuffer();

  const base64Img = Buffer.from(resizedImage).toString('base64')
  res.json({ listOfTeams: listOfTeams, image: base64Img});
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const team = await Teams.findByPk(id);
  res.json(team);
});

router.get("/bestScorerByTeamId/:id", async (req, res) => {
  const id = req.params.id;
  const bestScorer = await Players.findOne({
    where: { teamId: id },
    order: [['goals', 'DESC']]
  });
  res.json(bestScorer);
});

router.get("/bestAssistantByTeamId/:id", async (req, res) => {
  const id = req.params.id;
  const bestScorer = await Players.findOne({
    where: { teamId: id },
    order: [['assists', 'DESC']]
  });
  res.json(bestScorer);
});

router.get("/byPlayerId/:id", async (req, res) => {
  const id = req.params.id;
  const team = await Teams.findOne({
    where: { PlayerId: id },
  });
  res.json(team);
});

router.post("/", validateToken, async (req, res) => {
  const team = req.body;
  console.log(team)
  if(team.name!=null && team.league!=null){
    const foundedTeam = await Teams.findOne({
      where: {
        name: team.name
      }
    })
    if(foundedTeam==null){
      await Teams.create(team);
      res.json({
        name: team.name,
        league: team.league
      });
    }
    else{
      res.json("Team is already created");
    }
  }
  else{
    res.json("Missed params");
  }
});

router.delete("/:teamId", validateToken, async (req, res) => {
  const teamId = req.params.teamId;
  await Teams.destroy({
    where: {
      id: teamId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
