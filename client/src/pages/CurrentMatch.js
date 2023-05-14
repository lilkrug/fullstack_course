import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../helpers/AuthContext";

function Match() {
    let { id } = useParams();
    const [match, setMatch] = useState({});
    const [firstTeam, setFirstTeam] = useState({});
    const [secondTeam, setSecondTeam] = useState({});

    const { authState } = useContext(AuthContext);

    let history = useHistory();

    useEffect(() => {
        axios
            .get(`http://localhost:3001/matches/byId/${id}`, {
                headers: {
                accessToken: localStorage.getItem("accessToken"),
            },
        })
        .then((response) => {
            if (response.data.error) {
                Swal.fire({
                    icon: "error",
                    title: "Unauthorized",
                    text: response.data.error,
                    confirmButtonColor: "#3085d6",
                }).then(() => {
                    history.push("/login");
                });
            } else {
                console.log(response.data);
                setMatch(response.data);
                if (response.data != null) {
                    setFirstTeam(response.data.firstTeam);
                    setSecondTeam(response.data.secondTeam);
                }
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Unexpected error occurred",
                text: error.message,
                confirmButtonColor: "#3085d6",
            }).then(() => {
                history.push("/login");
            });
        });
}, []);

return (
    <div>
        {match.goals_first_team != null ? (
            <div>
                <h2>Match Information</h2>
                <h1>{firstTeam.name} {secondTeam.name}</h1>
                <p>Goals (First Team): {match.goals_first_team}</p>
                <p>Goals (Second Team): {match.goals_second_team}</p>
                <p>Corners (First Team): {match.numberOfCornersFirstTeam}</p>
                <p>Corners (Second Team): {match.numberOfCornersSecondTeam}</p>
                <p>Passes (First Team): {match.numberOfPassesFirstTeam}</p>
                <p>Passes (Second Team): {match.numberOfPassesSecondTeam}</p>
            </div>
        )
            :
            (
                <h1>Результат данного матча неизвестен</h1>
            )
        }
    </div>
);
}

export default Match;
