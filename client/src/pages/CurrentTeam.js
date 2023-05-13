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

  const handleDeleteClick = async () => {
    try {
      // Perform the delete request using Axios
      await axios.delete(`http://localhost:3001/teams/${id}`,
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

  let history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:3001/teams/byId/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        console.log('response')
        console.log(response.data)
        console.log('dasdas')
          setTeamObject(response.data);
      });

    axios.get(`http://localhost:3001/players/byTeamId/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        setPlayers(response.data);
      });

    axios.get(`http://localhost:3001/teams/bestScorerByTeamId/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        if (response.data != null) {
          setBestScorer(response.data);
        }
      });

    axios.get(`http://localhost:3001/teams/bestAssistantByTeamId/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        if (response.data != null) {
          setBestAssistant(response.data);
        }
      });
  }, []);


  return (
    <div>
      {authState.isAdmin == true && teamObject!=null &&(
            <button onClick={handleDeleteClick}>Удалить команду</button>
          )}
      {players.length != 0 ? (
        <div>
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
                      <td>{player.goals}</td>
                      <td>{player.assists}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
        :
        (
          teamObject!=null ? (
            <h1>Команда не сформирована</h1>
          ) : (
            <h1>Данной команды не существует</h1>
          )
        )
      }
    </div>
  );
}

export default Team;
