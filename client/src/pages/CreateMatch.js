import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

const MyForm = () => {
  const [dateTime, setDateTime] = useState('');
  const [teams, setTeams] = useState([]);
  const [firstTeamId, setFirstTeamId] = useState('');
  const [secondTeamId, setSecondTeamId] = useState('');

  let history = useHistory();
  
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
        console.log(localStorage.getItem("accessToken"))
        history.push("/login");
      } else {
    axios.get('http://localhost:3001/teams/teams', {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(response => {
        if(response.data.error!=undefined){
          history.push("/login");
        }
        else{
        console.log(response.data)
        setTeams(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/matches', {
        dateTime,
        firstTeamId,
        secondTeamId,
      },{
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      history.push("/");

      console.log(response.data); // Handle response data here
    } catch (error) {
      console.error(error); // Handle error here
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="datetime">Date and Time:</label>
        <input type="datetime-local" id="datetime" value={dateTime} onChange={(event) => setDateTime(event.target.value)} />
      </div>
      <div>
        <label htmlFor="firstTeamId">First team:</label>
        <select value={firstTeamId} onChange={(event) => setFirstTeamId(event.target.value)}>
          <option value="">-- Select team --</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="secondTeamId">Second Team:</label>
        <select value={secondTeamId} onChange={(event) => setSecondTeamId(event.target.value)}>
          <option value="">-- Select team --</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;