import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";



function Teams() {
  const [listOfTeams, setListOfTeams] = useState([]);
  const [image, setImage] = useState(null);
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
      // axios
      //   .get("http://localhost:3001/teams", {
      //     headers: { accessToken: localStorage.getItem("accessToken") },
      //     responseType: 'arraybuffer'
      //   })
      //   .then((response) => {
      //     //setListOfTeams(response.data.listOfTeams);
      //     setListOfTeams(null);
      //     const blob = new Blob([response.data],{type:'image/jpeg'});
      //     setImage(URL.createObjectURL(blob));
      //   });
    }
  }, []);

  return (
   <table>
    <tbody>
      {listOfTeams.map(item => (
        <tr key={item.id} onClick={() => {
          history.push(`/team/${item.id}`);
        }}>
          <td>
            <img src={`data:image/jpeg;base64,${image}`} alt="Image"></img>
            <h1>
                {item.name}
            </h1>
          </td>
          <td>{item.league}</td>
        </tr>
      ))}
    </tbody>
   </table>
  );
}

export default Teams;
