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
  res.json({ listOfTeams: listOfTeams, image: base64Img });
});

router.get("/teams", validateToken, async (req, res) => {
  const listOfTeams = await Teams.findAll();
  res.json(listOfTeams);
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const team = await Teams.findByPk(id);
  console.log(team)
  res.json(team);
});

router.put("/setfavoriteteam", validateToken, async (req, res) => {
  const userId = req.body.userId;
  const favTeam = Users.update(
    { favoriteTeamId: req.body.favoriteTeamId },
    { where: { id: userId } }
  )
  res.json(favTeam)
});

router.get("/getfavoriteteam/:id", validateToken, async (req, res) => {
  const userId = req.params.id;
  Users.findOne({
    where: { id: userId },
    include: { model: Teams }
  })
    .then((user) => {
      try {
        console.log(user.Team.name)
        console.log('okss')
        const teamName = user.Team // Название команды
        res.json(teamName)
      }
      catch{
        res.json(null)
      }
    })
});

router.get("/bestScorerByTeamId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const bestScorer = await Players.findOne({
    where: { teamId: id },
    order: [['goals', 'DESC']]
  });
  res.json(bestScorer);
});

router.get("/bestAssistantByTeamId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const bestScorer = await Players.findOne({
    where: { teamId: id },
    order: [['assists', 'DESC']]
  });
  res.json(bestScorer);
});

router.get("/byPlayerId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const team = await Teams.findOne({
    where: { PlayerId: id },
  });
  res.json(team);
});

router.post("/", validateToken, isAdmin, async (req, res) => {
  const team = req.body;
  console.log(team)
  if (team.name != null) {
    const foundedTeam = await Teams.findOne({
      where: {
        name: team.name
      }
    })
    if (foundedTeam == null) {
      const createdTeam = await Teams.create(team);
      await Results.create({
        scored_goals: 0,
        conceded_goals: 0,
        points: 0,
        team_id: createdTeam.id
      })
      res.json({
        name: team.name
      });
    }
    else {
      res.json("Team is already created");
    }
  }
  else {
    res.json("Missed params");
  }
});

router.delete("/:teamId", validateToken, isAdmin, async (req, res) => {
  const teamId = req.params.teamId;
  Teams.findOne({
    where: { id: teamId },
    include: [Players]
  }).then(team => {
    if (team) {
      Players.destroy({
        where: {
          teamId: teamId,
        },
      })
      Results.destroy({
        where: {
          team_id: teamId,
        },
      })
      Matches.destroy({
        where: {
          [Op.or]: [
            { firstTeamId: teamId },
            { secondTeamId: teamId }
          ]
        },
      })
      Teams.destroy({
        where: {
          id: teamId,
        },
      })
    }
  });
  // await Teams.destroy({
  //   where: {
  //     id: teamId,
  //   },
  //   include: [Players], 
  // });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
