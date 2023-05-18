const express = require("express");
const router = express.Router();
const Hotels = require("../models").Hotels;
const Tours = require("../models").Tours;
const isAdmin = require("../middlewares/isAdmin");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  try {
    const listOfHotels = await Hotels.findAll();
    res.json(listOfHotels);
  }
  catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/edit/:id", validateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const updatedHotel = req.body;
  console.log(updatedHotel)

  if (
    updatedHotel.name == null ||
    updatedHotel.city == null ||
    updatedHotel.starRating < 0
  ) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  try {
    const hotel = await Hotels.findByPk(id);

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    const existingHotel = await Hotels.findOne({
      where: { name: updatedHotel.name },
    });

    if (existingHotel && existingHotel.id !== hotel.id) {
      return res.status(409).json({ error: "Hotel name is already taken" });
    }

    hotel.name = updatedHotel.name;
    hotel.city = updatedHotel.city;
    hotel.starRating = updatedHotel.starRating;

    await hotel.save();

    res.json({
      name: hotel.name,
      city: hotel.city,
      starRating: hotel.starRating,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", validateToken, async (req, res) => {
  const hotel = req.body;
  console.log(hotel)
  if (hotel.name != null && hotel.city != null && hotel.starRating != null) {
    try {
      const foundedHotel = await Hotels.findOne({
        where: {
          name: hotel.name,
        },
      });
      if (foundedHotel == null) {
          await Hotels.create(hotel)
          res.json(hotel)
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

router.delete("/:hotelId", validateToken, async (req, res) => {
  const hotelId = req.params.hotelId;
  if (hotelId != null) {
    try {
      const foundedHotel = await Hotels.findOne({
        where: {
          id: hotelId
        },
      });
      if (foundedHotel != null) {
        await Tours.destroy({
          where: {
            hotelId: hotelId,
          },
        });
        await Hotels.destroy({
          where: {
            id: hotelId,
          },
        });
        res.json("Deleted Successfully");
      }
      else {
        res.status(404).json({ error: "Hotel doesn't exist" });
      }
    }
    catch (error) {
      console.log(error)
      res.status(500).json({ error: "Internal server error" });
    }
  }
  else {
    res.status(400).json({ error: "Missing hotelId" });
  }
});

module.exports = router;
