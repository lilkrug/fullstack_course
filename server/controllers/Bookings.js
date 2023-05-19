const express = require("express");
const router = express.Router();
const Bookings = require("../models").Bookings;
const Hotels = require("../models").Hotels;
const Tours = require("../models").Tours;
const Users = require("../models").Users;
const isAdmin = require("../middlewares/isAdmin");

const { validateToken } = require("../middlewares/AuthMiddleware");

router.get("/", validateToken, async (req, res) => {
    try {
        const listOfBookings = await Bookings.findAll({
            include: [
                {
                    model: Tours
                },
                {
                    model: Users,
                    attributes: ['id', 'username']
                }
            ]
        });
        res.json(listOfBookings);
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/byId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const booking = await Bookings.findOne({
            where: { id: id },
            include: [Tours],
        });
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/byUserId/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    try {
        const booking = await Bookings.findAll({
            where: { userId: id },
            include: [{
                model: Tours,
                include: [Hotels]
            }]
        });
        res.json(booking);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", validateToken, async (req, res) => {
    const booking = req.body;
    console.log(booking)
    if (booking.userId != null && booking.tourId != null && booking.fromDate != null && booking.toDate != null) {
        try {
            const foundedTour = await Tours.findOne({
                where: {
                    id: booking.tourId,
                },
            });
            if (foundedTour != null) {
                await Bookings.create(booking);
                res.json({ booking });
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


router.put("/edit/:id", validateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const updatedBooking = req.body;
    console.log(updatedBooking)
    console.log(updatedBooking.dateFrom)
    console.log(Date.parse(updatedBooking.dateFrom) > Date.parse(updatedBooking.dateTo))
    // Validate dateFrom and dateTo
    const currentDate = new Date().toISOString().split("T")[0];
    if (
        Date.parse(updatedBooking.dateFrom) < Date.parse(currentDate) ||
    Date.parse(updatedBooking.dateTo) < Date.parse(currentDate) ||
    Date.parse(updatedBooking.dateFrom) > Date.parse(updatedBooking.dateTo)
    ) {
        return res.status(400).json({ error: "Invalid dates" });
    }

    if (
        updatedBooking.userId == null ||
        updatedBooking.tourId == null
    ) {
        return res.status(400).json({ error: "Invalid parameters" });
    }

    try {
        const user = await Users.findByPk(updatedBooking.userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const tour = await Tours.findByPk(updatedBooking.tourId);

        if (!tour) {
            return res.status(404).json({ error: "Tour not found" });
        }

        await Bookings.update(updatedBooking, {
            where: { id: id },
        });

        res.json({
            id: id,
            userId: updatedBooking.userId,
            cityId: updatedBooking.tourId,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;