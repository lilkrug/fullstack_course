const express = require("express");
const router = express.Router();
const Cities = require("../models").Cities;
const Hotels = require("../models").Hotels;
const Tours = require("../models").Tours;
const isAdmin = require("../middlewares/isAdmin");


const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
  const listOfCities = await Cities.findAll();
  res.json(listOfCities );
});

router.post("/", validateToken, async (req, res) => {
  const city = req.body;
  if (city.name != null) {
    try {
      const foundedCity = await Cities.findOne({
        where: {
          name: city.name,
        },
      });
      if (foundedCity == null) {
        await Cities.create(city);
        res.json({
          name: city.name
        });
      }
      else {
        res.status(409).json({ error: "City already exists" });
      }
    }
    catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  else {
    res.status(400).json({ error: "Missing parameters" });
  }
});

router.put("/:id", validateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing params" });
    }

    const city = await Cities.findByPk(id);

    if (!city) {
      return res.status(404).json({ error: "Team not found" });
    }

    const existingCity = await Cities.findOne({
      where: { name },
    });

    if (existingCity && existingCity.id !== city.id) {
      return res.status(409).json({ error: "City name is already taken" });
    }

    city.name = name;
    await city.save();

    res.json({ name: city.name });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:cityId", validateToken, async (req, res) => {
  const cityId = req.params.cityId;
  if (cityId != null) {
    try {
      const foundedCity = await Cities.findOne({
        where: {
          id: cityId
        },
      });
      if (foundedCity != null) {
        await Hotels.destroy({
          where: {
            cityId: cityId,
          },
        });
        await Cities.destroy({
          where: {
            id: cityId,
          },
        });
        res.json("Deleted Successfully");
      }
      else {
        res.status(404).json({ error: "City doesn't exist" });
      }
    }
    catch (error) {
      console.log(error)
      res.status(500).json({ error: "Internal server error" });
    }
  }
  else {
    res.status(400).json({ error: "Missing cityId" });
  }
});

module.exports = router;