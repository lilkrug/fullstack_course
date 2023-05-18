const express = require("express");
const router = express.Router();
const Bookings = require("../models").Bookings;
const Hotels = require("../models").Hotels;
const Tours = require("../models").Tours;
const isAdmin = require("../middlewares/isAdmin");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    try {
        const listOfTours = await Tours.findAll({ include: [Hotels] });
        res.json(listOfTours);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/byTourId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const tour = await Tours.findAll({
            where: { id: id },
            include: [Hotels, Tours],
        });
        res.json(tour);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", validateToken, async (req, res) => {
    const tour = req.body;
    console.log(tour)
    try {
        if (tour.name != null && tour.priceOneDay != null && tour.priceOneDay > 0 && tour.hotelId != null) {
            try {
                const foundedTour = await Tours.findOne({
                    where: {
                        name: tour.name,
                    },
                });
                if (foundedTour == null) {
                    console.log(tour.hotelId)
                    const foundedHotel = await Hotels.findOne({
                        where: {
                            id: tour.hotelId,
                        },
                    });
                    if (foundedHotel != null) {
                        await Tours.create(tour);
                        res.json({ tour });
                    }
                    else {
                        res.status(404).json({ error: "Hotel doesn't exist" });
                    }
                }
                else {
                    res.status(409).json({ error: "Tour already exists" });
                }
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        }
        else {
            res.status(400).json({ error: "Missing parameters" });
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
});


router.put("/edit/:id", validateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const updatedTour = req.body;
    console.log(updatedTour)

    if (
        updatedTour.name == null ||
        updatedTour.hotelId == null ||
        updatedTour.priceOneDay < 0
    ) {
        return res.status(400).json({ error: "Invalid parameters" });
    }

    try {
        const tour = await Tours.findByPk(id);

        if (!tour) {
            return res.status(404).json({ error: "Tour not found" });
        }

        const existingTour = await Tours.findOne({
            where: { name: updatedTour.name },
        });

        if (existingTour && existingTour.id !== tour.id) {
            return res.status(409).json({ error: "Tour name is already taken" });
        }

        const isHotelExisting = await Hotels.findOne({
            where: {
                id: updatedTour.hotelId,
            },
        });

        if (!isHotelExisting) {
            return res.status(404).json({ error: "Hotel doesn't exist" });
        }

        tour.name = updatedTour.name;
        tour.hotelId = updatedTour.hotelId;
        tour.priceOneDay = updatedTour.priceOneDay;

        await tour.save();

        res.json({
            name: tour.name,
            cityId: tour.hotelId,
            starRating: tour.priceOneDay,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    const tourId = req.params.id;
    if (tourId != null) {
        try {
            const foundedTour = await Tours.findOne({
                where: {
                    id: tourId,
                },
            });
            if (foundedTour != null) {
                await Tours.destroy({
                    where: {
                        id: tourId,
                    },
                });
                res.json("Deleted Successfully");
            }
            else {
                res.status(404).json({ error: "Tour doesn't exist" });
            }
        }
        catch (error) {
            console.log(error)
            res.status(500).json({ error: "Internal server error" });
        }
    }
    else {
        res.status(400).json({ error: "Missing bookingId" });
    }
});

module.exports = router;