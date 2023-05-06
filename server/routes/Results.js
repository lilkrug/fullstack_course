const express = require("express");
const router = express.Router();
const { Results } = require("../models");
const { Teams } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    const listOfResults = await Results.findAll({ include: [Teams] });
    res.json(listOfResults);
});

router.get("/byTeamId/:id",validateToken, async (req, res) => {
    const id = req.params.id;
    const result = await Results.findOne(
        {
            where: {
                team_id: id
            }
        }
    );
    res.json(result);
});

router.post("/", validateToken, async (req, res) => {
    const post = req.body;
    console.log(req)
    console.log(post)
    post.username = req.user.username;
    post.UserId = req.user.id;
    await Posts.create(post);
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
