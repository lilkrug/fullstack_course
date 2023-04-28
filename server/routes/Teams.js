const express = require("express");
const router = express.Router();
const Teams = require("../models").Teams;
const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfTeams = await Teams.findAll();
  res.json({ listOfTeams: listOfTeams});
});

router.get("/byId/:id", async (req, res) => {
  const id = req.params.id;
  const team = await Teams.findByPk(id);
  res.json(post);
});

router.get("/byplayerId/:id", async (req, res) => {
  const id = req.params.id;
  const team = await Teams.findAll({
    where: { PlayerId: id },
  });
  res.json(team);
});

router.post("/", validateToken, async (req, res) => {
  const team = req.body;
  console.log(req.body)
  console.log('fsadfasdfsad')
  await Teams.create(team);
  res.json(team);
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
