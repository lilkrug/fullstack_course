import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Player() {
  let { id } = useParams();
  const [player, setPlayer] = useState({});
  const [fieldPosition, setFieldPosition] = useState({});
  const [team, setTeam] = useState({});

  const { authState } = useContext(AuthContext);

  let history = useHistory();

  const handleDeleteClick = async () => {
    try {
      // Perform the delete request using Axios
      await axios.delete(`http://localhost:3001/players/${id}`,
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }).then((response) => {
          console.log('response')
          console.log(response.data)
          if (response.data.error != undefined) {
            history.push("/login");
          }
          else {
            history.push("/");
          }
        });

      // Perform any additional actions after successful deletion
      // For example, you can update the state or show a success message
    } catch (error) {
      // Handle errors if the request fails
      console.error(error);
      // Perform any necessary error handling or show an error message
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/players/byId/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        if (response.data.error != undefined) {
          history.push("/login");
        }
        else {
          console.log(response.data)
          setPlayer(response.data);
          if (response.data != null) {
            setFieldPosition(response.data.FieldPosition)
            setTeam(response.data.Team)
          }
        }
      });
  }, []);

  return (
    <div>
      {player ? (
        <div className="player-info">
          <h1>Информация о футболисте</h1>
          <h2>{player.name}</h2>
          <div className="player-info-row">
            <div className="player-info-label">Голы:</div>
            <div className="player-info-value">{player.goals}</div>
          </div>
          <div className="player-info-row">
            <div className="player-info-label">Ассисты:</div>
            <div className="player-info-value">{player.assists}</div>
          </div>
          <div className="player-info-row">
            <div className="player-info-label">Позиция:</div>
            <div className="player-info-value">{fieldPosition.name}</div>
          </div>
          <div className="player-info-row">
            <div className="player-info-label">Команда:</div>
            <div className="player-info-value">{team.name}</div>
          </div>
        </div>
      )
        :
        (
          <h1>Данного футболиста не существует</h1>
        )
      }
      {authState.isAdmin == true && player != null && (
        <button onClick={handleDeleteClick}>Удалить игрока</button>
      )}
    </div>
  );
}

export default Player;
