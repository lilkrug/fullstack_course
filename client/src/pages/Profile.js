import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import Swal from 'sweetalert2';
import { Formik, Form } from "formik";

function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [listOfBookings, setListOfBookings] = useState([]);
  const [username, setUsername] = useState("");
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      fetchData()
    }
  }, []);


  const fetchData = async () => {
    try {
      axios.get(`http://localhost:3001/auth/basicinfo/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
        .then((response) => {
          if (response.data == null) {
            setUsername(null);
          } else {
            setUsername(response.data.username);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      axios.get(`http://localhost:3001/bookings/byUserId/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
        .then((response) => {
          if (response.data == null) {
            setListOfBookings(null);
          } else {
            console.log(response.data)
            setListOfBookings(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/bookings/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Успех",
          text: "Бронирование отменено",
        });
        fetchData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Ошибка",
          text: "Не удалось отменить бронирование",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Ошибка",
        text: "Не удалось отменить бронирование",
      });
      console.error(error);
    }
  };

  return (
    <div className="profilePageContainer1">
      {username != null ? (<div className="profilePageContainer">
        <div className="basicInfo">
          {" "}
            <div className="formContainer">
              <h1> Имя пользователя: {username} </h1>
              {authState.username === username && (
                <>
                  <button
                    onClick={() => {
                      history.push("/changepassword");
                    }}
                  >
                    {" "}
                    Изменить пароль
                  </button>
                  <div>
                    {listOfBookings.length == 0 ? (
                      <p>Нет бронирований</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Количество дней</th>
                            <th>Тур</th>
                            <th>Отель</th>
                            <th>Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listOfBookings.map((item) => (
                            <tr key={item.id}>
                              <td>{item.id}</td>
                              <td>
                                {item.numberOfDays}
                              </td>
                              <td>
                                {item.Tour.name}
                              </td>
                              <td>
                                {item.Tour.Hotel.name}
                              </td>
                              <td>
                                <button onClick={() => handleDelete(item.id)}>Отменить бронирование</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </div>
        </div>
      </div>
      )
        :
        (
          <h2>Нет такого пользователя</h2>
        )
      }
    </div >
  );
}

export default Profile;
