import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from "../helpers/AuthContext";

const BookingsTable = () => {
    const [listOfBookings, setListOfBookings] = useState([]);
    const [listOfUsers, setListOfUsers] = useState([]);
    const [listOfTours, setListOfTours] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [updatedValues, setUpdatedValues] = useState({});
    const [originalValues, setOriginalValues] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const { authState } = useContext(AuthContext);

    let history = useHistory();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            history.push("/login");
        } else {
            fetchData()
        }
    }, []);

    const fetchData = async () => {
        try {
            axios
                .get("http://localhost:3001/bookings", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        console.log('bookings')
                        console.log(response.data)
                        setListOfBookings(response.data);
                    }
                });
            axios
                .get("http://localhost:3001/tours", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        setListOfTours(response.data);
                    }
                });
            axios
                .get("http://localhost:3001/auth/bookings", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        setListOfUsers(response.data);
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
                title: "Нет обновления",
                text: "Вы не сделали никаких обновлений.",
            });
            return;
        }
        try {
            await axios.put(`http://localhost:3001/bookings/edit/${id}`, updatedValues, {
                headers: { accessToken: localStorage.getItem("accessToken") }
            });
            Swal.fire({
                icon: "success",
                title: "Успех",
                text: "Бронирование успешно обновлено",
            });
            setEditingId(null); // Завершение режима редактирования
            fetchData(); // Обновление данных после обновления
        } catch (error) {
            console.error(error);
            let errorMessage = "Не удалось обновить бронирование";

            if (error.response && error.response.status === 400) {
                errorMessage = "Отсутствующие параметры";
            } else if (error.response && error.response.status === 404) {
                errorMessage = "Бронирование не найдено";
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
        if (name === "numberOfDays") {
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
            const response = await axios.delete(`http://localhost:3001/bookings/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Успех",
                    text: "Отель успешно удален",
                });
                fetchData();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Ошибка",
                    text: "Не удалось удалить отель",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Ошибка",
                text: "Не удалось удалить отель",
            });
            console.error(error);
        }
    };

    return (
        <div>
            {listOfBookings === null ? (
                <p>Нет бронирований</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Количество дней</th>
                            <th>Имя покупателя</th>
                            <th>Тур</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listOfBookings.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                    {editingId === item.id ? (
                                        <input
                                            type="number"
                                            name="numberOfDays"
                                            value={updatedValues.numberOfDays || item.numberOfDays}
                                            onChange={(e) => handleInputChange(e, item.id)}
                                        />
                                    ) : (
                                        item.numberOfDays
                                    )}
                                </td>

                                <td>
                                    {editingId === item.id ? (
                                        <select
                                            name="userId"
                                            value={updatedValues.userId || item.userId}
                                            onChange={(e) => handleInputChange(e, item.id)}
                                        >
                                            {listOfUsers.map((user) => (
                                                <option key={user.id} value={user.id}>{user.username}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        item.User.username
                                    )}
                                </td>
                                <td>
                                    {editingId === item.id ? (
                                        <select
                                            name="tourId"
                                            value={updatedValues.tourId || item.tourId}
                                            onChange={(e) => handleInputChange(e, item.id)}
                                        >
                                            {listOfTours.map((tour) => (
                                                <option key={tour.id} value={tour.id}>{tour.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        item.Tour.name
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
                                            <button onClick={() => handleEdit(item.id, { id: item.id, numberOfDays: item.numberOfDays, tourId: item.tourId, userId: item.userId })}>Изменить</button>
                                            <button onClick={() => handleDelete(item.id)}>Удалить</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BookingsTable;