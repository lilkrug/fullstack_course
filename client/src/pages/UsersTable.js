import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from "../helpers/AuthContext";

const UsersTable = () => {
    const [listOfUsers, setListOfUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [updatedValues, setUpdatedValues] = useState({});
    const { authState } = useContext(AuthContext);

    let history = useHistory();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            console.log(localStorage.getItem("accessToken"))
            history.push("/login");
        } else {
            fetchData()
        }
    }, []);

    const fetchData = async () => {
        try {
            axios
                .get("http://localhost:3001/auth/", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    console.log(response.data.error != undefined)
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        setListOfUsers(response.data);
                    }
                });
        } catch (error) {
            console.log(error)
            history.push("/");
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setUpdatedValues({});
    };


    const handleUpdate = async (id) => {
        const fieldsUpdated = Object.keys(updatedValues).length > 0;

        if (!fieldsUpdated) {
            Swal.fire({
                icon: "info",
                title: "Нет обновления",
                text: "Вы не сделали никаких обновлений.",
                confirmButtonColor: '#fe6401',
            });
            return;
        }
        try {
            await axios.put(`http://localhost:3001/auth/${id}`, updatedValues, {
                headers: { accessToken: localStorage.getItem("accessToken") }
            });
            Swal.fire({
                icon: "success",
                title: "Успех",
                text: "Пользователь успешно обновлен",
                confirmButtonColor: '#fe6401',
              });
            setEditingId(null); // Завершение режима редактирования
            fetchData(); // Обновление данных после обновления
        } catch (error) {
            console.error(error);
            let errorMessage = "Не удалось обновить пользователя";

            if (error.response && error.response.status === 400) {
                errorMessage = "Отсутствующие параметры";
            } else if (error.response && error.response.status === 404) {
                errorMessage = "Пользователь не найден";
            } else if (error.response && error.response.status === 409) {
                errorMessage = "Имя пользователя уже используется";
            } else if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: errorMessage,
                confirmButtonColor: '#fe6401',
            });
        }
    };

    const handleDelete = async (id) => {
        try {
          const response = await axios.delete(`http://localhost:3001/auth/${id}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          });
      
          if (response.data.message === "Пользователь успешно удален") {
            Swal.fire({
              icon: "success",
              title: "Успех",
              text: "Пользователь успешно удален",
              confirmButtonColor: '#fe6401',
            });
            fetchData(); // Обновление данных после удаления
          } else {
            Swal.fire({
              icon: "error",
              title: "Ошибка",
              text: "Не удалось удалить пользователя",
              confirmButtonColor: '#fe6401',
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Ошибка",
            text: "Не удалось удалить пользователя",
            confirmButtonColor: '#fe6401',
          });
          console.error(error);
        }
      };

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя пользователя</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                {listOfUsers.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.username}</td>
                        <td>
                            {editingId === item.id ? (
                                <>
                                    <button onClick={() => handleUpdate(item.id)}>Обновить</button>
                                    <button onClick={handleCancelEdit}>Отменить</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleDelete(item.id)}>Удалить</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UsersTable;