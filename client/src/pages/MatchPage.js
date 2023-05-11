import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useHistory } from "react-router-dom";
import MatchTeams from '../components/MatchTeams';
import Chat from './Chat'
import { AuthContext } from "../helpers/AuthContext";

function MatchPage() {
  let { id } = useParams();
  let history = useHistory();
  const [matchData, setMatchData] = useState(null);
  const { authState } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const matchId = 123; // здесь нужно указать id матча, данные о котором нужно получить

  const handleUpdate = () => {
    console.log(localStorage.getItem("accessToken"))
    axios.post(`http://localhost:3001/matches/sethot/${id}`,
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }).then((response) => {console.log(response.data)})
    // axios.put(`http://localhost:3001/matches/sethot/${id}`, {
    //   headers: {
    //     accessToken: localStorage.getItem("accessToken")
    //   },
    // })
    //   .then(() => {
    //     // Запрос успешно выполнен
    //     console.log('Match updated successfully.');
    //   })
    //   .catch((error) => {
    //     // Обработка ошибки
    //     console.error('Error updating match:', error);
    //   });
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    async function fetchData() {
      try {
        await axios.get(`http://localhost:3001/matches/byId/${id}`,
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
              console.log(response.data.firstTeam.name)
              setMatchData(response.data);
            }
          })
      } catch (err) {
        setError(err);
      }
    }
    fetchData();
  }, [matchId]);

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  } else if (!matchData) {
    return <div>Загрузка...</div>;
  } else {
    return (
      <div>
        {authState.isAdmin && (
          <>
            <button onClick={handleUpdate}>
              Сделать обсуждаемым
            </button>
          </>
        )}
        <div className="match-block">
          <div className="match-block-team">
            <p>{matchData.firstTeam.name}</p>
          </div>
          <div className="match-block-team">
            <p>{matchData.secondTeam.name}</p>
          </div>
        </div>
        {matchData.isHot && <Chat />}
      </div>
    );
  }
}

export default MatchPage;