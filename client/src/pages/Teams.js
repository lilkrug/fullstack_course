import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";



function Teams(props) {
  const [listOfTeams, setListOfTeams] = useState([]);
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { authState } = useContext(AuthContext);

  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      console.log(localStorage.getItem("accessToken"))
      history.push("/login");
    } else {
      axios
        .get("http://localhost:3001/teams", {
          headers: { accessToken: localStorage.getItem("accessToken") }
        })
        .then((response) => {
          setListOfTeams(response.data.listOfTeams);
          setImage(response.data.image);
        });
    }
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by team name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <tbody>
          {listOfTeams.filter((team) => {
    const regex = new RegExp(`^${searchTerm}`, "i");
    return regex.test(team.name);
  })
            .map((item) => (
              <tr
                key={item.id}
                onClick={() => {
                  history.push(`/team/${item.id}`);
                }}
              >
                <td>
                  <img
                    src={`data:image/jpeg;base64,${image}`}
                    alt="Image"
                  ></img>
                  <h1>{item.name}</h1>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Teams;
