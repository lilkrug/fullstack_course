import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";

function Matches() {
  const [matches, setMatches] = useState([]);
  const { authState } = useContext(AuthContext);
  let history = useHistory();

  useEffect(() => {
    console.log(localStorage.getItem("accessToken"))
    if (!localStorage.getItem("accessToken")) {
      console.log(localStorage.getItem("accessToken"))
      history.push("/login");
    } else {
      axios
        .get("http://localhost:3001/matches/", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          console.log(response.data)
          if (response.data.error != undefined) {
            localStorage.removeItem("accessToken")
            history.push("/login");
          }
          else {
            setMatches(response.data);
          }
        });
    }
  }, []);

  return (
    <div>
      {matches.length != 0 && (
        <table>
          <thead>
            <tr>
              <th>Время</th>
              <th>Команда 1</th>
              <th>Команда 2</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index}
                onClick={() => {
                    history.push(`/matchinfo/${match.id}`);
                }}>
                <td>{new Date(match.dateTime).toLocaleTimeString()}</td>
                <td>{match.firstTeam.name}</td>
                <td>{match.secondTeam.name}</td>
              </tr>
            ))}
          </tbody>
        </table>)
      }
    </div>
  );
}

export default Matches;
