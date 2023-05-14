const express = require("express");
const router = express.Router();
const { Posts, Likes, } = require("../models");
const Teams = require("../models").Teams;
const PostsTeams = require("../models").PostsTeams;

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  try {
    const listOfPosts = await Posts.findAll({ include: [Likes] });
    const likedPosts = await Likes.findAll({ where: { UserId: req.user.id } });
    res.json({ listOfPosts, likedPosts });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/byId/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/byuserId/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const listOfPosts = await Posts.findAll({
      where: { UserId: id },
      include: [Likes],
    });
    res.json(listOfPosts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/byteamId/:id", validateToken, async (req, res) => {
  try {
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
        },
        {
          model: Likes
        }
      ]
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", validateToken, async (req, res) => {
  try {
    const post = req.body;
    console.log(post);
    post.username = req.user.username;
    post.UserId = req.user.id;
    const createdPost = await Posts.create(post);
    if (req.body.teamId != null) {
      const postTeam = {
        PostId: createdPost.id,
        TeamId: req.body.teamId
      };

      await PostsTeams.create(postTeam);
    }
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/title", validateToken, async (req, res) => {
  try {
    const { newTitle } = req.body;
    const postId = req.params.id;
    await Posts.update({ title: newTitle }, { where: { id: postId } });
    res.json(newTitle);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id/postText", validateToken, async (req, res) => {
  try {
    const { newText } = req.body;
    const postId = req.params.id;
    await Posts.update({ postText: newText }, { where: { id: postId } });
    res.json(newText);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
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
