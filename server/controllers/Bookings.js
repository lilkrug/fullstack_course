const express = require("express");
const router = express.Router();
const Bookings = require("../models").Bookings;
const Hotels = require("../models").Hotels;
const Tours = require("../models").Tours;


const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    try {
        const listOfBookings = await Bookings.findAll();
        res.json(listOfBookings);
    }
    catch(error){
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/byUserId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    try {
      const booking = await Bookings.findAll({
        where: { UserId: id },
        include: [Hotels, Tours],
      });
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

router.post("/", validateToken, async (req, res) => {
    const booking = req.body;
    if (booking.UserId!=null&&booking.TourId!=null&&booking.count_of_people!=null) {
        try {
            const foundedTour = await Tours.findOne({
                where: {
                    id: booking.TourId,
                },
            });
            if (foundedTour != null) {
                await Bookings.create(booking);
                res.json({booking});
            }
            else {
                res.status(404).json({ error: "Tour doesn't exist" });
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

router.delete("/:bookingId", validateToken, async (req, res) => {
    const bookingId = req.params.bookingId;
    if (bookingId != null) {
        try {
            const foundedBooking = await Bookings.findOne({
                where: {
                    id: bookingId,
                },
            });
            if (foundedBooking != null) {
                await Bookings.destroy({
                    where: {
                        id: bookingId,
                    },
                });
                res.json("Deleted Successfully");
            }
            else {
                res.status(404).json({ error: "Booking doesn't exist" });
            }
        }
        catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
    else {
        res.status(400).json({ error: "Missing bookingId" });
    }
});

module.exports = router;