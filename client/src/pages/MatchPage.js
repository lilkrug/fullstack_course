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

  const setHot = async () => {
    console.log(localStorage.getItem("accessToken"))
    axios
      .post(`http://localhost:3001/matches/sethot/${id}`,{}, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        console.log(response)
        if(response.data.error!=undefined){
          history.push("/login");
        }
        else{
          history.push("/");
        }
      });
  };

  const unsetHot = async () => {
    console.log(localStorage.getItem("accessToken"))
    axios
      .post(`http://localhost:3001/matches/unsethot`,{}, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        console.log(response)
        if(response.data.error!=undefined){
          history.push("/login");
        }
        else{
          history.push("/");
        }
      });
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
        {authState.isAdmin && matchData.isHot==null|matchData.isHot==false&&(
          <>
            <button onClick={setHot}>
              Сделать обсуждаемым
            </button>
          </>
        )}
        {authState.isAdmin && matchData.isHot==true&&(
          <>
            <button onClick={unsetHot}>
              Закончить пиздеж
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