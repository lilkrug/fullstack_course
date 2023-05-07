const { User } = require("../models");

const isAdmin = (req, res, next) => {
  const user = req.user;

  if (!user.isAdmin) {
    return res.status(401).json({ message: 'You are not allowed to do that' });
  }

  next();
};

module.exports = isAdmin;