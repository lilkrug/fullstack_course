import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from "../helpers/AuthContext";

const HotelsTable = () => {
    const [listOfTours, setListOfTours] = useState([]);
    const [listOfHotels, setListOfHotels] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [updatedValues, setUpdatedValues] = useState({});
    const [originalValues, setOriginalValues] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
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
                .get("https://course-project-75u9.onrender.com/tours", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    console.log(response.data.error != undefined)
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        console.log(response.data)
                        setListOfTours(response.data);
                    }
                });
            axios
                .get("https://course-project-75u9.onrender.com/hotels", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    console.log(response.data.error != undefined)
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        console.log(response.data)
                        setListOfHotels(response.data);
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (id, values) => {
        setEditingId(id);
        setUpdatedValues(values);
        setOriginalValues(values);
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
                title: "Нет обновлений",
                text: "Вы не сделали никаких обновлений.",
            });
            return;
        }
        try {
            await axios.put(`https://course-project-75u9.onrender.com/tours/edit/${id}`, updatedValues, {
                headers: { accessToken: localStorage.getItem("accessToken") }
            });
            Swal.fire({
                icon: "success",
                title: "Успех",
                text: "Тур успешно обновлен",
            });
            setEditingId(null); // Завершение режима редактирования
            fetchData(); // Обновление данных после обновления
        } catch (error) {
            console.error(error);
            let errorMessage = "Не удалось обновить отель.";

            if (error.response && error.response.status === 400) {
                errorMessage = "Отсутствующие параметры";
            } else if (error.response && error.response.status === 404) {
                errorMessage = "Тур не найден";
            } else if (error.response && error.response.status === 409) {
                errorMessage = "Название тура уже занято";
            } else if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: errorMessage,
            });
        }
    };

    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        if (name === 'name' && value.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: 'Имя не может быть пустым',
            });
            return;
        }
        if (name === "priceOneDay") {
            if (value < 0 || isNaN(value)) {
                // Вывод алерта при вводе недопустимого значения
                Swal.fire({
                    icon: 'error',
                    title: 'Ошибка',
                    text: 'Значение должно быть неотрицательным числом',
                });
                return;
            }
        }

        setUpdatedValues({ ...updatedValues, [name]: value });
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`https://course-project-75u9.onrender.com/tours/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Успех",
                    text: "Тур успешно удален",
                });
                fetchData();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Ошибка",
                    text: "Не удалось удалить тур",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ошибка",
                text: "Не удалось удалить тур",
            });
            console.error(error);
        }
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Цена в день</th>
                    <th>Отель</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                {listOfTours.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={updatedValues.name || item.name}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.name
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="number"
                                    name="priceOneDay"
                                    min={1}
                                    value={updatedValues.priceOneDay || item.priceOneDay}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.priceOneDay
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <select
                                    name="hotelId"
                                    value={updatedValues.hotelId || item.hotelId}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                >
                                    {listOfHotels.map((hotel) => (
                                        <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                                    ))}
                                </select>
                            ) : (
                                item.Hotel.name
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <>
                                    <button onClick={() => handleUpdate(item.id)}>Обновить</button>
                                    <button onClick={handleCancelEdit}>Отменить</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEdit(item.id, { id: item.id, name: item.name, priceOneDay: item.priceOneDay, hotelId: item.hotelId })}>Изменить</button>
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

export default HotelsTable;