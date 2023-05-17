const { verify } = require("jsonwebtoken");
const { Users } = require("../models");

const validateToken = async (req, res, next) => {
  const accessToken = req.header("accessToken");
  if (!accessToken) {
    return res.status(401).json({ error: "User not logged in!" });
  }

  try {
    const decodedToken = verify(accessToken, "importantsecret");
    const user = await Users.findByPk(decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    req.user = user;

    // Check if token has expired
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTimestamp) {
      return res.status(401).json({ error: "Token has expired" });
    }

    return next();
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { validateToken };
