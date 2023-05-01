import React, { useState, useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const MatchForm = () => {
    const { authState } = useContext(AuthContext);

    const [matchList, setMatchList] = useState([]);
    const [matchId, setMatchId] = useState("");
    const [goalsFirstTeam, setGoalsFirstTeam] = useState("");
    const [goalsSecondTeam, setGoalsSecondTeam] = useState("");

    let history = useHistory();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            console.log(localStorage.getItem("accessToken"))
            history.push("/login");
        } else {
            axios.get("http://localhost:3001/matches", {
                headers: { accessToken: localStorage.getItem("accessToken") },
            }).then((response) => {
                setMatchList(response.data);
            });
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .put(`http://localhost:3001/matches/${matchId}`, {
                goals_first_team: goalsFirstTeam,
                goals_second_team: goalsSecondTeam,
            }, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                console.log(response);
            });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Match ID:
                    <select value={matchId} onChange={(e) => setMatchId(e.target.value)}>
                        {matchList.map((match) => (
                            <option key={match.id} value={match.id}>
                                {match.id}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Goals First Team:
                    <input
                        type="text"
                        value={goalsFirstTeam}
                        onChange={(e) => setGoalsFirstTeam(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Goals Second Team:
                    <input
                        type="text"
                        value={goalsSecondTeam}
                        onChange={(e) => setGoalsSecondTeam(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default MatchForm;