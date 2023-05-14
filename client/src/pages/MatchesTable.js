import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from "../helpers/AuthContext";

const MatchesTable = () => {
    const [listOfMatches, setListOfMatches] = useState([]);
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
                .get("http://localhost:3001/matches", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    console.log(response.data.error != undefined)
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        setListOfMatches(response.data);
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

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3001/matches/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            });

            if (response.data.message === "Match deleted successfully") {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Match deleted successfully",
                });
                fetchData(); // Обновление данных после удаления
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete match",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete match",
            });
            console.error(error);
        }
    };


    const handleUpdate = async (id) => {
        if (JSON.stringify(updatedValues) === JSON.stringify(originalValues)) {
            Swal.fire({
                icon: 'info',
                title: 'Information',
                text: 'Вы ничего не обновили',
            });
            setEditingId(null); // Завершение режима редактирования
            return;
        }

        try {
            await axios.put(`http://localhost:3001/matches/${id}`, updatedValues, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Match updated successfully',
            });
            setEditingId(null); // Завершение режима редактирования
            fetchData(); // Обновление данных после обновления
        } catch (error) {
            console.error(error);
            let errorMessage = 'Failed to update match';

            if (error.response && error.response.status === 400) {
                errorMessage = 'Missing parameters';
            } else if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        }
    };

    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        if (name === "goalsFirstTeam" || name === "goalsSecondTeam" || name === "numberOfPassesFirstTeam" || name === "numberOfPassesSecondTeam" || name === "numberOfCornersFirstTeam" || name === "numberOfCornersSecondTeam") {
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

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Первая команда</th>
                    <th>Вторая команда</th>
                    <th>Забила первая команда</th>
                    <th>Забила вторая команда</th>
                    <th>Пасы первая команда</th>
                    <th>Пасы вторая команда</th>
                    <th>Угловые первая команда</th>
                    <th>Угловые вторая команда</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                {listOfMatches.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.firstTeam.name}</td>
                        <td>{item.secondTeam.name}</td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="number"
                                    name="goalsFirstTeam"
                                    value={updatedValues.goalsFirstTeam || item.goalsFirstTeam}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.goals_first_team
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="number"
                                    name="goalsSecondTeam"
                                    value={updatedValues.goalsSecondTeam || item.goalsSecondTeam}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.goals_second_team
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="number"
                                    name="numberOfPassesFirstTeam"
                                    value={updatedValues.numberOfPassesFirstTeam || item.numberOfPassesFirstTeam}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.numberOfPassesFirstTeam
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="number"
                                    name="numberOfPassesSecondTeam"
                                    value={updatedValues.numberOfPassesSecondTeam || item.numberOfPassesSecondTeam}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.numberOfPassesSecondTeam
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="number"
                                    name="numberOfCornersFirstTeam"
                                    value={updatedValues.numberOfCornersFirstTeam || item.numberOfCornersFirstTeam}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.numberOfCornersFirstTeam
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="number"
                                    name="numberOfCornersSecondTeam"
                                    value={updatedValues.numberOfCornersSecondTeam || item.numberOfCornersSecondTeam}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.numberOfCornersSecondTeam
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
                                    <button onClick={() => handleEdit(item.id, { id: item.id, name: item.name, goals: item.goals, assists: item.assists, fieldPositionId: item.fieldPositionId, teamId: item.teamId })}>Изменить</button>
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

export default MatchesTable;