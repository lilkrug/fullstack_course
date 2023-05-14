const express = require("express");
const router = express.Router();
const { Op } = require('sequelize');
const { validateToken } = require("../middlewares/AuthMiddleware");
const Teams = require("../models").Teams;
const Matches = require("../models").Matches;
const Results = require("../models").Results;
const isAdmin = require("../middlewares/isAdmin");
const { Message } = require("../models");

router.get("/", validateToken, async (req, res) => {
    try {
        const listOfMatches = await Matches.findAll({
            include: [
                { model: Teams, as: "firstTeam" },
                { model: Teams, as: "secondTeam" }
            ]
        });
        res.json(listOfMatches);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/withoutScore", validateToken, async (req, res) => {
    try {
        const listOfMatches = await Matches.findAll({
            where: {
                goals_first_team: null,
                goals_second_team: null
            },
            include: [
                { model: Teams, as: "firstTeam" },
                { model: Teams, as: "secondTeam" }
            ]
        });
        res.json(listOfMatches);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/byId/:id", validateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const match = await Matches.findOne({
            where: { id: id },
            include: [
                {
                    model: Teams,
                    as: "firstTeam",
                    attributes: ["name"]
                },
                {
                    model: Teams,
                    as: "secondTeam",
                    attributes: ["name"]
                }
            ]
        });
        res.json(match);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/sethot/:id", validateToken, async (req, res) => {
    try {
        const id = req.params.id;
        await Matches.update({ isHot: null }, {
            where: { isHot: true },
        });
        await Message.destroy({
            where: {} // Specify other conditions if needed
        });
        await Matches.update({ isHot: true }, {
            where: { id: id },
        });
        res.json('Successfully set as hot');
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/unsethot", validateToken, async (req, res) => {
    try {
        await Matches.update({ isHot: false }, {
            where: { isHot: true },
        });
        await Message.destroy({
            where: {} // Specify other conditions if needed
        });
        res.json('Successfully unset hot');
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/today", async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const matches = await Matches.findAll({
            where: {
                dateTime: {
                    [Op.between]: [startOfToday, endOfToday]
                }
            },
            include: [
                {
                    model: Teams,
                    as: 'firstTeam',
                    attributes: ['name']
                },
                {
                    model: Teams,
                    as: 'secondTeam',
                    attributes: ['name']
                }
            ]
        });

        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", validateToken, isAdmin, async (req, res) => {
    try {
        const match = req.body;
        console.log(match);
        if (
            match.dateTime != null &&
            match.firstTeamId != null &&
            match.secondTeamId != null
        ) {
            if (match.firstTeamId !== match.secondTeamId) {
                const isTeamsExisting = await Teams.findAll({
                    where: {
                        id: {
                            [Op.in]: [match.firstTeamId, match.secondTeamId],
                        },
                    },
                });
                console.log(isTeamsExisting.length);
                if (isTeamsExisting.length === 2) {
                    await Matches.create(match);
                    res.json("Success");
                } else {
                    res.status(400).json("Team doesn't exist");
                }
            } else {
                res.status(400).json("You can't place the same team against yourself");
            }
        } else {
            res.status(400).json("Missed params");
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

function matchResult(goalsFirstTeam, goalsSecondTeam) {
    let pointsFirstTeam, pointsSecondTeam;
    if (goalsFirstTeam > goalsSecondTeam) {
        pointsFirstTeam = 3
        pointsSecondTeam = 0
    }
    else if (goalsFirstTeam < goalsSecondTeam) {
        pointsFirstTeam = 0
        pointsSecondTeam = 3
    }
    else {
        pointsFirstTeam = 1
        pointsSecondTeam = 1
    }
    let result = {
        pointsFirstTeam: pointsFirstTeam,
        pointsSecondTeam: pointsSecondTeam
    }
    return result
}

router.put("/:matchId", validateToken, isAdmin, async (req, res) => {
    try {
        const matchId = req.params.matchId;
        const match = req.body;
        if (
            matchId != null &&
            match.goalsFirstTeam != null &&
            match.goalsSecondTeam != null
        ) {
            const isMatchExisting = await Matches.findOne({
                where: {
                    id: matchId,
                },
            });

            if (isMatchExisting != null) {
                await Matches.update(
                    {
                        goals_first_team: match.goalsFirstTeam,
                        goals_second_team: match.goalsSecondTeam,
                        numberOfPassesFirstTeam: match.numberOfPassesFirstTeam,
                        numberOfPassesSecondTeam: match.numberOfPassesSecondTeam,
                        numberOfCornersFirstTeam: match.numberOfCornersFirstTeam,
                        numberOfCornersSecondTeam: match.numberOfCornersSecondTeam,
                    },
                    { where: { id: matchId } }
                );

                let result = matchResult(
                    match.goalsFirstTeam,
                    match.goalsSecondTeam
                );

                const teamResults = await Results.findAll({
                    where: {
                        team_id: {
                            [Op.in]: [isMatchExisting.firstTeamId, isMatchExisting.secondTeamId],
                        },
                    },
                });

                const firstTeam = teamResults.find(
                    (team) => team.team_id === isMatchExisting.firstTeamId
                );
                const secondTeam = teamResults.find(
                    (team) => team.team_id === isMatchExisting.secondTeamId
                );

                await Results.update(
                    {
                        scored_goals: firstTeam.scored_goals + parseInt(match.goalsFirstTeam),
                        conceded_goals: firstTeam.conceded_goals + parseInt(match.goalsSecondTeam),
                        points: firstTeam.points + result.pointsFirstTeam,
                    },
                    {
                        where: { team_id: isMatchExisting.firstTeamId },
                    }
                );

                await Results.update(
                    {
                        scored_goals: secondTeam.scored_goals + parseInt(match.goalsSecondTeam),
                        conceded_goals: secondTeam.conceded_goals + parseInt(match.goalsFirstTeam),
                        points: secondTeam.points + result.pointsSecondTeam,
                    },
                    {
                        where: { team_id: isMatchExisting.secondTeamId },
                    }
                );

                res.json("Match updated successfully");
            } else {
                res.status(400).json("Match doesn't exist");
            }
        } else {
            res.status(400).json("Missing parameters");
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:matchId", validateToken, isAdmin, async (req, res) => {
    try {
        const matchId = req.params.matchId;
        await Matches.destroy({
            where: {
                id: matchId,
            },
        });
        res.json("Match deleted successfully");
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;