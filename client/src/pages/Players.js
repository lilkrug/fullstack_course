import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Players(props) {
  const [listOfPlayers, setListOfPlayers] = useState([]);
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { authState } = useContext(AuthContext);

  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      axios
        .get("http://localhost:3001/players", {
          headers: { accessToken: localStorage.getItem("accessToken") }
        })
        .then((response) => {
          if (response.data.error != undefined) {
            history.push("/login");
          } else {
            console.log(response.data.listOfPlayers)
            setListOfPlayers(response.data.listOfPlayers);
          }
        });
    }
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by player name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Team</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          {listOfPlayers
            .filter((player) => {
              const regex = new RegExp(`^${searchTerm}`, "i");
              return regex.test(player.name);
            })
            .map((item) => (
              <tr
                key={item.id}
                onClick={() => {
                  history.push(`/player/${item.id}`);
                }}
              >
                <td>
                  <h1>{item.name}</h1>
                </td>
                <td>{item.goals}</td>
                <td>{item.assists}</td>
                <td>{item.Team.name}</td>
                <td>{item.FieldPosition.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Players;