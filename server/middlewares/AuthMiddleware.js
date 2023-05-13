const { verify } = require("jsonwebtoken");
const { Users } = require("../models");

const validateToken = async (req, res, next) => {
  const accessToken = req.header("accessToken");
  console.log(accessToken);
  if (!accessToken) return res.status(401).json({ error: "User not logged in!" });

  try {
    const validToken = verify(accessToken, "importantsecret");
    const user = await Users.findByPk(validToken.id);
    if (!user) return res.status(404).json({ error: "User not found!" });
    req.user = user;

    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { validateToken };
