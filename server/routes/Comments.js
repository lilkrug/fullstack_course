const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Get comments by postId
router.get("/:postId", async (req, res) => {
try {
const postId = req.params.postId;
const comments = await Comments.findAll({ where: { PostId: postId } });
res.json(comments);
} catch (error) {
res.status(500).json({ error: "Failed to fetch comments" });
}
});

// Create a comment
router.post("/", validateToken, async (req, res) => {
try {
const comment = req.body;
const username = req.user.username;
comment.username = username;
const createdComment = await Comments.create(comment);
comment.id = createdComment.id;
res.json(comment);
} catch (error) {
res.status(500).json({ error: "Failed to create comment" });
}
});

// Delete a comment by commentId
router.delete("/:commentId", validateToken, async (req, res) => {
try {
const commentId = req.params.commentId;
await Comments.destroy({
where: {
id: commentId,
},
});
res.json("Deleted sucessfully");
} catch (error) {
res.status(500).json({ error: "Failed to delete comment" });
}
});

module.exports = router;
