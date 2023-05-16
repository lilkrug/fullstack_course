const express = require("express");
const router = express.Router();
const { Posts, Likes,  } = require("../models");
const Teams = require("../models").Teams;
const Cities = require("../models").Cities;
const PostsTeams = require("../models").PostsTeams;

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfCities = await Cities.findAll();
  res.json({ listOfCities: listOfCities });
});

router.get("/byId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});

router.get("/byuserId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const listOfPosts = await Posts.findAll({
    where: { UserId: id },
    include: [Likes],
  });
  res.json(listOfPosts);
});

router.get("/byteamId/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const posts = await Posts.findAll({
    include: [
      {
        model: Teams,
        attributes: [],
        through: PostsTeams,
        where: {
          id: id
        }
      }
    ]
  });
  console.log(posts);
  res.json(posts);
});

router.post("/", validateToken, async (req, res) => {
  const city = req.body;
  const createdCity = await Cities.create(city);
  res.json(city);
});

router.delete("/:cityId", validateToken, async (req, res) => {
  const cityId = req.params.cityId;
  await Cities.destroy({
    where: {
      id: cityId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;