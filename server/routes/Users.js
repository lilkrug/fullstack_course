const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then(async (hash) => {
    const foundedUser = await Users.findOne({
      where: {
        username: username
      }
    })
    if(foundedUser==null){
      await Users.create({
        username: username,
        password: hash,
      });
      res.json("SUCCESS");
    }
    else{
      res.json("User is already created");
    }
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  if(username!=undefined){
  const user = await Users.findOne({ where: { username: username } });
  if (!user) res.json({ error: "User Doesn't Exist" });
  else{
  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match){ res.json({ error: "Wrong Username And Password Combination" });}
    else{
    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret",
      { expiresIn: "30m" }
    );
    res.json({ token: accessToken, username: username, id: user.id });
    }
  });
  }
  }
  else{
    res.json({error: "username is null"})
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicinfo/:id",validateToken, async (req, res) => {
  const id = req.params.id;

  const basicInfo = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
  });
  res.json(basicInfo)
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Wrong Password Entered!" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      res.json("SUCCESS");
    });
  });
});

module.exports = router;
