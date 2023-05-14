const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const isAdmin = require("../middlewares/isAdmin");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

// Создание пользователя
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const foundUser = await Users.findOne({ where: { username } });
    if (foundUser) {
      res.status(409).json({error: "User is already created" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Users.create({
        username,
        password: hashedPassword,
      });
      res.json("Created user");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve all users
router.get("/", validateToken, async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a user
router.delete("/:id", validateToken,isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findByPk(id);
    console.log(user)
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      await user.destroy();
      res.json({ message: "User deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Авторизация пользователя
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }
  try {
    const user = await Users.findOne({ where: { username } });
    if (!user) {
      res.status(404).json({ error: "User doesn't exist" });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).json({ error: "Wrong Username and Password combination" });
      } else {
        const accessToken = sign(
          { username: user.username, id: user.id },
          "importantsecret",
          { expiresIn: "30m" }
        );
        res.json({ token: accessToken, username: username, id: user.id, isAdmin: user.isAdmin });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

// Получение информации о пользователе
router.get("/basicinfo/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const basicInfo = await Users.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    res.json(basicInfo);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Изменение пароля пользователя
router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await Users.findOne({ where: { username: req.user.username } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      res.status(401).json({ error: "Wrong Password Entered!" });
    } else {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await Users.update(
        { password: hashedPassword },
        { where: { username: req.user.username } }
      );
      res.json("Successfully changed password");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
