import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";

function Home() {
  const [listOfTours, setListOfTours] = useState([]);
  const { authState } = useContext(AuthContext);
  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      Swal.fire({
        icon: 'error',
        title: 'Неавторизованный',
        text: 'Пользователь не авторизован!',
        confirmButtonColor: '#fe6401',
      }).then(() => {
        localStorage.removeItem("accessToken");
        history.push("/login");
      });
    } else {
      axios
        .get("http://localhost:3001/tours", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          if (response.status === 401) {
            Swal.fire({
              icon: 'error',
              title: 'Неавторизованный',
              text: 'Срок действия токена истек',
              confirmButtonColor: '#fe6401',
            }).then(() => {
              localStorage.removeItem("accessToken");
              history.push("/login");
            });
          } else if (response.data.error != undefined) {
            Swal.fire({
              icon: 'error',
              title: 'Ошибка',
              text: response.data.error,
              confirmButtonColor: '#fe6401',
            }).then(() => {
              localStorage.removeItem("accessToken");
              history.push("/login");
            });
          } else {
            setListOfTours(response.data);
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Произошла непредвиденная ошибка',
            text: error.message,
            confirmButtonColor: '#fe6401',
          }).then(() => {
            localStorage.removeItem("accessToken");
            history.push("/login");
          });
        });
    }
  }, []);

  return (
    <div className="home-page">
      <div>
        <div className="formContainer">
          {listOfTours.map((tour, key) => {
            return (
              <div key={key} className="tourItem">
                <h3>{tour.name}</h3>
                <p>Цена за день: ${tour.priceOneDay}</p>
                <p>Гостиница: {tour.Hotel.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
