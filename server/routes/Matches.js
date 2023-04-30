const express = require("express");
const router = express.Router();
const { Op } = require('sequelize');
const { validateToken } = require("../middlewares/AuthMiddleware");
const Teams = require("../models").Teams;
const Matches = require("../models").Matches;

router.get("/", validateToken, async (req, res) => {
    const listOfMatches = await Matches.findAll({
        include: [
            {model: Teams, as :"firstTeam"},
            {model: Teams, as :"secondTeam"}
        ]
    });
    res.json({ listOfMatches: listOfMatches });
});

router.get("/byId/:id", async (req, res) => {
    const id = req.params.id;
    const match = await Matches.findOne({
        where: { id: id },
        include: [Teams]
    })
    res.json(match);
});

router.post("/", validateToken, async (req, res) => {
    const match = req.body;
    console.log(match)
    if (match.date != null && match.firstTeamId != null && match.secondTeamId != null) {
        const isTeamsExisting = await Teams.findAll({
            where: {
                id: {
                    [Op.in]:[match.firstTeamId,match.secondTeamId]
                }
            }
        })
        console.log(isTeamsExisting.length)
        if (isTeamsExisting.length == 2) {
            await Matches.create(match);
            res.json({
                date: match.date,
                firstTeamId: match.firstTeamId,
                secondTeamId: match.secondTeamId,
                goals_first_team: match.goals_first_team,
                goals_second_team: match.goals_second_team
            });
        }
        else {
            res.json("Team doesn't exist");
        }
    }
    else {
        res.json("Missed params");
    }
});

router.delete("/:matchId", validateToken, async (req, res) => {
    const matchId = req.params.matchId;
    await Matches.destroy({
        where: {
            id: matchId,
        },
    });

    res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
