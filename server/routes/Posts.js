const express = require("express");
const router = express.Router();
const { Posts, Likes,  } = require("../models");
const Teams = require("../models").Teams;
const PostsTeams = require("../models").PostsTeams;

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfPosts = await Posts.findAll({ include: [Likes] });
  const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
  res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
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
  const post = req.body;
  console.log(post)
  post.username = req.user.username;
  post.UserId = req.user.id;
  const createdPost = await Posts.create(post);
  if (req.body.teamId != null) {
    const postTeam = {
      PostId: createdPost.id,
      TeamId: req.body.teamId
    }

    await PostsTeams.create(postTeam)
  }
  res.json(post);
});

router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});

router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;
  await Posts.update({ postText: newText }, { where: { id: id } });
  res.json(newText);
});

router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  await Posts.destroy({
    where: {
      id: postId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
