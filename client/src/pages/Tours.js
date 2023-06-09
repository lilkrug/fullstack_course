import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";



function Tours() {
  const [listOfTours, setListOfTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { authState } = useContext(AuthContext);

  let history = useHistory();

  useEffect(() => {
    try {
      if (!localStorage.getItem("accessToken")) {
        console.log(localStorage.getItem("accessToken"))
        history.push("/login");
      } else {
        axios
          .get("https://course-project-75u9.onrender.com/tours", {
            headers: { accessToken: localStorage.getItem("accessToken") }
          })
          .then((response) => {
            console.log(response.data.error != undefined)
            if (response.data.error != undefined) {
              history.push("/login");
            }
            else {
              setListOfTours(response.data);
            }
          });
      }
    }
    catch(error){
      console.log(error)
      history.push("/");
    }
  }, []);

  return (
    <div>{listOfTours.length > 0 ? (
      <div>
        <input
          type="text"
          placeholder="Search by tour name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table>
          <tbody>
            {listOfTours.filter((tour) => {
              const regex = new RegExp(`^${searchTerm}`, "i");
              return regex.test(tour.name);
            })
              .map((item) => (
                <tr
                  key={item.id}
                >
                  <td>
                    <h1>{item.name}</h1>
                    <h2>Отель:{item.Hotel.name}</h2>
                    <h2>Цена за день:{item.priceOneDay}</h2>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    ) :
      (
        <h1>Таких туров нет</h1>
      )}
    </div>
  );
}

export default Tours;
