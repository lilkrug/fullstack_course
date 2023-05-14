import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from "../helpers/AuthContext";

const PlayersTable = () => {
    const [listOfPlayers, setListOfPlayers] = useState([]);
    const [listOfTeams, setListOfTeams] = useState([]);
    const [listOfPositions, setListOfPositions] = useState([]);
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
                .get("http://localhost:3001/players", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    console.log(response.data.error != undefined)
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        console.log(response.data.listOfPlayers)
                        setListOfPlayers(response.data.listOfPlayers);
                    }
                });
            axios
                .get("http://localhost:3001/teams", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    console.log(response.data.error != undefined)
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        setListOfTeams(response.data.listOfTeams);
                    }
                });
            axios
                .get("http://localhost:3001/fieldPositions", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    console.log(response.data.error != undefined)
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        setListOfPositions(response.data.listOfPositions);
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
                title: "No Update",
                text: "You haven't made any updates.",
            });
            return;
        }
        try {
            await axios.put(`http://localhost:3001/players/edit/${id}`, updatedValues, {
                headers: { accessToken: localStorage.getItem("accessToken") }
            });
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Player updated successfully",
            });
            setEditingId(null); // Завершение режима редактирования
            fetchData(); // Обновление данных после обновления
        } catch (error) {
            console.error(error);
            let errorMessage = "Failed to update player";

            if (error.response && error.response.status === 400) {
                errorMessage = "Missing parameters";
            } else if (error.response && error.response.status === 404) {
                errorMessage = "Player not found";
            } else if (error.response && error.response.status === 409) {
                errorMessage = "Player name is already taken";
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
        if (name === 'name' && value.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Name cannot be empty',
            });
            return;
        }
        if (name === "goals" || name === "assists") {
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
            const response = await axios.delete(`http://localhost:3001/teams/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            });

            if (response.data === "Deleted successfully") {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Player deleted successfully",
                });
                fetchData(); // Обновление данных после удаления
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete player",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete player",
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
                    <th>Голы</th>
                    <th>Ассисты</th>
                    <th>Позиция</th>
                    <th>Команда</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                {listOfPlayers.map((item) => (
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
                                    name="goals"
                                    value={updatedValues.goals || item.goals}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.goals
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="number"
                                    name="assists"
                                    value={updatedValues.assists || item.assists}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.assists
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <select
                                    name="fieldPositionId"
                                    value={updatedValues.fieldPositionId || item.fieldPositionId}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                >
                                    {listOfPositions.map((position) => (
                                        <option key={position.id} value={position.id}>{position.name}</option>
                                    ))}
                                </select>
                            ) : (
                                item.FieldPosition.name
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <select
                                    name="teamId"
                                    value={updatedValues.teamId || item.teamId}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                >
                                    {listOfTeams.map((team) => (
                                        <option key={team.id} value={team.id}>{team.name}</option>
                                    ))}
                                </select>
                            ) : (
                                item.Team.name
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

export default PlayersTable;