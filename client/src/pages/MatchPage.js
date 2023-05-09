import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from "react-router-dom";
import MatchTeams from '../components/MatchTeams';
import Chat from './Chat'

function MatchPage() {
  let { id } = useParams();
  let history = useHistory();
  const [matchData, setMatchData] = useState(null);
  const [error, setError] = useState(null);
  const matchId = 123; // здесь нужно указать id матча, данные о котором нужно получить

  useEffect(() => {
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
        <div className="match-block">
          <div className="match-block-team">
            <p>{matchData.firstTeam.name}</p>
          </div>
          <div className="match-block-team">
            <p>{matchData.secondTeam.name}</p>
          </div>
        </div>
        <Chat></Chat>
      </div>
    );
  }
}

export default MatchPage;