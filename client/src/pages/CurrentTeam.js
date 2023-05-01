import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Team() {
  let { id } = useParams();
  const [teamObject, setTeamObject] = useState({});
  const [bestScorer, setBestScorer] = useState({});
  const [bestAssistant, setBestAssistant] = useState({});
  const [players, setPlayers] = useState([]);
  const { authState } = useContext(AuthContext);

  let history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:3001/teams/byId/${id}`).then((response) => {
     setTeamObject(response.data);
    });

    axios.get(`http://localhost:3001/players/byTeamId/${id}`).then((response) => {
      setPlayers(response.data);
    });

    axios.get(`http://localhost:3001/teams/bestScorerByTeamId/${id}`).then((response) => {
      if(response.data!=null){
      setBestScorer(response.data);
      }
    });

    axios.get(`http://localhost:3001/teams/bestAssistantByTeamId/${id}`).then((response) => {
      if(response.data!=null){
      setBestAssistant(response.data);
      }
    });
  }, []);

  
  return (
    <div>
      {teamObject ? (
    <div className="team-page">
          <h1 className="team-name">{teamObject.name}</h1>
          <div className="best-players">
            <div className="best-scorer">
              <h3>Best scorer</h3>
              <p onClick={() => {
          history.push(`/player/${bestScorer.id}`);
          }}>
          {bestScorer.name}
          </p>
            </div>
            <div className="best-assistant">
              <h3>Best assistant</h3>
              <p onClick={() => {
          history.push(`/player/${bestAssistant.id}`);
          }}>
            {bestAssistant.name}</p>
            </div>
          </div>
          <div className="player-list">
            <h2>Players:</h2>
            <table>
              <thead>
                <tr>
                  <th>Field Position</th>
                  <th>Name</th>
                  <th>Number</th>
                  <th>Matches</th>
                  <th>Goals</th>
                  <th>Assists</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id}>
                    <td>{player.FieldPosition.name}</td>
                    <td onClick={() => {
          history.push(`/player/${player.id}`);
        }}>{player.name}</td>
                    <td>{player.fieldNumber}</td>
                    <td>{player.matches}</td>
                    <td>{player.goals}</td>
                    <td>{player.assists}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
    </div>
      )
      :
      (
        <h1>Данной команды не существует</h1>
      )
}
    </div>
  );
}

export default Team;