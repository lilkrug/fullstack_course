import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from 'sweetalert2';
import { AuthContext } from "../helpers/AuthContext";

const TeamsTable = () => {
    const [listOfTeams, setListOfTeams] = useState([]);
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
            await axios.put(`http://localhost:3001/teams/${id}`, updatedValues, {
                headers: { accessToken: localStorage.getItem("accessToken") }
            });
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Team updated successfully",
              });
            setEditingId(null); // Завершение режима редактирования
            fetchData(); // Обновление данных после обновления
        } catch (error) {
            console.error(error);
            let errorMessage = "Failed to update team";

            if (error.response && error.response.status === 400) {
                errorMessage = "Missing parameters";
            } else if (error.response && error.response.status === 404) {
                errorMessage = "Team not found";
            } else if (error.response && error.response.status === 409) {
                errorMessage = "Team name is already taken";
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
              text: "Team deleted successfully",
            });
            fetchData(); // Обновление данных после удаления
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to delete team",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete team",
          });
          console.error(error);
        }
      };

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {listOfTeams.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{editingId === item.id ? (
                            <input
                                type="text"
                                name="name"
                                value={updatedValues.name || item.name}
                                onChange={(e) => handleInputChange(e, item.id)}
                            />
                        ) : (
                            item.name
                        )}</td>
                        <td>
                            {editingId === item.id ? (
                                <>
                                    <button onClick={() => handleUpdate(item.id)}>Обновить</button>
                                    <button onClick={handleCancelEdit}>Отменить</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => handleEdit(item.id, { id: item.id, name: item.name })}>Изменить</button>
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

export default TeamsTable;