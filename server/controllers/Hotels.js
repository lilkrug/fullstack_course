const express = require("express");
const router = express.Router();
const Hotels = require("../models").Hotels;
const Teams = require("../models").Teams;
const Cities = require("../models").Cities;
const isAdmin = require("../middlewares/isAdmin");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  try {
    const listOfHotels = await Hotels.findAll({ include: [Cities] });
    res.json({ listOfHotels: listOfHotels });
  }
  catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", validateToken, async (req, res) => {
  const hotel = req.body;
  console.log(hotel)
  if (hotel.name != null && hotel.cityId != null && hotel.starRating != null) {
    try {
      const foundedHotel = await Hotels.findOne({
        where: {
          name: hotel.name,
        },
      });
      if (foundedHotel == null) {
        const foundedCity = await Cities.findOne({
          where: {
            id: hotel.cityId,
          },
        });
        if (foundedCity != null) {
          await Hotels.create(hotel)
          res.json(hotel)
        }
        else {
          res.status(404).json({ error: "City doesn't exist" });
        }
      }
      else {
        res.status(409).json({ error: "Hotel already exists" });
      }
    }
    catch (error) {
      console.log(error)
      res.status(500).json({ error: "Internal server error" });
    }
  }
  else {
    res.status(400).json({ error: "Missing parameters" });
  }
});

router.put("/edit/:id", validateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const updatedHotel = req.body;

  if (
    updatedHotel.name == null ||
    updatedHotel.teamId == null ||
    updatedHotel.fieldPositionId == null ||
    updatedPlayer.goals < 0 ||
    updatedPlayer.assists < 0
  ) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  try {
    const player = await Players.findByPk(id);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    const existingPlayer = await Players.findOne({
      where: { name: updatedPlayer.name },
    });

    if (existingPlayer && existingPlayer.id !== player.id) {
      return res.status(409).json({ error: "Player name is already taken" });
    }

    const isTeamExisting = await Teams.findOne({
      where: {
        id: updatedPlayer.teamId,
      },
    });

    if (!isTeamExisting) {
      return res.status(404).json({ error: "Team doesn't exist" });
    }

    const isPositionExisting = await FieldPositions.findOne({
      where: {
        id: updatedPlayer.fieldPositionId,
      },
    });

    if (!isPositionExisting) {
      return res.status(404).json({ error: "Position doesn't exist" });
    }

    player.name = updatedPlayer.name;
    player.teamId = updatedPlayer.teamId;
    player.fieldPositionId = updatedPlayer.fieldPositionId;
    player.goals = updatedPlayer.goals;
    player.assists = updatedPlayer.assists;

    await player.save();

    res.json({
      name: player.name,
      teamId: player.teamId,
      fieldPosition: player.fieldPositionId,
      goals: player.goals,
      assists: player.assists,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
