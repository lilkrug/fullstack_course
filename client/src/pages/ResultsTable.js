import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from "../helpers/AuthContext";

const ResultsTable = () => {
    const [listOfResults, setListOfResults] = useState([]);
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
                .get("http://localhost:3001/results", {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                })
                .then((response) => {
                    console.log(response.data.error != undefined)
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        setListOfResults(response.data);
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
          await axios.put(`http://localhost:3001/results/edit/${id}`, updatedValues, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          });
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'League table updated successfully',
          });
          setEditingId(null); // Завершение режима редактирования
          fetchData(); // Обновление данных после обновления
        } catch (error) {
          console.error(error);
          let errorMessage = 'Failed to update league table';
      
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
        if (name === "scored_goals" || name === "conceded_goals"|| name === "points") {
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
                    <th>Команда</th>
                    <th>Забито голов</th>
                    <th>Пропущено голов</th>
                    <th>Очки</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                {listOfResults.map((item) => (
                    <tr key={item.id}>
                        <td>{item.Team.name}</td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="number"
                                    name="scored_goals"
                                    value={updatedValues.scored_goals || item.scored_goals}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.scored_goals
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="number"
                                    name="conceded_goals"
                                    value={updatedValues.conceded_goals || item.conceded_goals}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.conceded_goals
                            )}
                        </td>
                        <td>
                            {editingId === item.id ? (
                                <input
                                    type="number"
                                    name="points"
                                    value={updatedValues.points || item.points}
                                    onChange={(e) => handleInputChange(e, item.id)}
                                />
                            ) : (
                                item.points
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
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ResultsTable;