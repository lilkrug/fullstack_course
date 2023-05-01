import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Player() {
  let { id } = useParams();
  const [player, setPlayer] = useState({});
  const [fieldPosition, setFieldPosition] = useState({});
  const { authState } = useContext(AuthContext);

  let history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:3001/players/byId/${id}`).then((response) => {
      setPlayer(response.data);
      if (response.data != null) {
        setFieldPosition(response.data.FieldPosition)
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
            <div className="player-info-label">Матчи:</div>
            <div className="player-info-value">{player.matches}</div>
          </div>
          <div className="player-info-row">
            <div className="player-info-label">Позиция:</div>
            <div className="player-info-value">{fieldPosition.name}</div>
          </div>
          <div className="player-info-row">
            <div className="player-info-label">Команда:</div>
            <div className="player-info-value">{player.teamId}</div>
          </div>
        </div>
      )
        :
        (
          <h1>Данного футболиста не существует</h1>
        )
      }
    </div>
  );
}

export default Player;
