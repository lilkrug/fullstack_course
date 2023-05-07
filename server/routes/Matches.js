const express = require("express");
const router = express.Router();
const { Op } = require('sequelize');
const { validateToken } = require("../middlewares/AuthMiddleware");
const Teams = require("../models").Teams;
const Matches = require("../models").Matches;
const Results = require("../models").Results;
const isAdmin  = require("../middlewares/isAdmin");

router.get("/", validateToken, async (req, res) => {
    const listOfMatches = await Matches.findAll({
        include: [
            { model: Teams, as: "firstTeam" },
            { model: Teams, as: "secondTeam" }
        ]
    });
    res.json(listOfMatches);
});

router.get("/withoutScore", validateToken, async (req, res) => {
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
});

router.get("/byId/:id", async (req, res) => {
    const id = req.params.id;
    const match = await Matches.findOne({
        where: { id: id },
        include: [Teams]
    })
    res.json(match);
});

router.get("/today", async (req, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const matches = await Matches.findAll({
        where: {
            dateTime: {
                [Op.between]: [startOfToday, endOfToday]
            }
        }
    })
    console.log(matches)
    res.json(matches);
});

router.post("/", validateToken,isAdmin, async (req, res) => {
    const match = req.body;
    console.log(match)
    if (match.dateTime != null && match.firstTeamId != null && match.secondTeamId != null) {
        if (match.firstTeamId != match.secondTeamId) {
            const isTeamsExisting = await Teams.findAll({
                where: {
                    id: {
                        [Op.in]: [match.firstTeamId, match.secondTeamId]
                    }
                }
            })
            console.log(isTeamsExisting.length)
            if (isTeamsExisting.length == 2) {
                await Matches.create(match);
                res.json("Success");
            }
            else {
                res.json("Team doesn't exist");
            }
        }
        else {
            res.json("You can't place the same team against yourself");
        }
    }
    else {
        res.json("Missed params");
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

router.put("/:matchId", validateToken,isAdmin, async (req, res) => {
    const matchId = req.params.matchId;
    const match = req.body;
    if (matchId != null && match.goalsFirstTeam != null && match.goalsSecondTeam != null) {
        const isMatchExisting = await Matches.findOne({
            where: {
                id: matchId
            }
        })
        if (isMatchExisting != null) {
            await Matches.update(
                {
                    goals_first_team: match.goalsFirstTeam,
                    goals_second_team: match.goalsSecondTeam
                },
                { where: { id: matchId } })
            let result = matchResult(match.goalsFirstTeam, match.goalsSecondTeam)
            const teamResults = await Results.findAll({
                where: {
                    id: {
                        [Op.in]: [isMatchExisting.firstTeamId, isMatchExisting.secondTeamId]
                    }
                }
            })
            const firstTeam = teamResults.find(team => team.id === isMatchExisting.firstTeamId);
            const secondTeam = teamResults.find(team => team.id === isMatchExisting.secondTeamId);
            await Results.update(
                {
                    scored_goals: firstTeam.scored_goals+parseInt(match.goalsFirstTeam),
                    conceded_goals: firstTeam.conceded_goals + parseInt(match.goalsSecondTeam),
                    points: firstTeam.points + result.pointsFirstTeam
                },
                {
                    where: { id: isMatchExisting.firstTeamId }
                }
            )
            await Results.update(
                {
                    scored_goals: secondTeam.scored_goals + parseInt(match.goalsSecondTeam),
                    conceded_goals: secondTeam.conceded_goals + parseInt(match.goalsFirstTeam),
                    points: secondTeam.points + result.pointsSecondTeam
                },
                {
                    where: { id: isMatchExisting.secondTeamId }
                }
            )
            res.json("Match updated successfully");
        }
        else {
            res.json("Team doesn't exist");
        }
    }
    else {
        res.json("Missed params");
    }
});

router.delete("/:matchId", validateToken,isAdmin, async (req, res) => {
    const matchId = req.params.matchId;
    await Matches.destroy({
        where: {
            id: matchId,
        },
    });

    res.json("DELETED SUCCESSFULLY");
});

module.exports = router;
