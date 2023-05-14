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
            console.error(error);
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
                title: "No Update",
                text: "You haven't made any updates.",
            });
            return;
        }
        try {
            await axios.put(`http://localhost:3001/auth/${id}`, updatedValues, {
                headers: { accessToken: localStorage.getItem("accessToken") }
            });
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "User updated successfully",
              });
            setEditingId(null); // Завершение режима редактирования
            fetchData(); // Обновление данных после обновления
        } catch (error) {
            console.error(error);
            let errorMessage = "Failed to update user";

            if (error.response && error.response.status === 400) {
                errorMessage = "Missing parameters";
            } else if (error.response && error.response.status === 404) {
                errorMessage = "User not found";
            } else if (error.response && error.response.status === 409) {
                errorMessage = "User name is already taken";
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
          const response = await axios.delete(`http://localhost:3001/auth/${id}`, {
            headers: { accessToken: localStorage.getItem("accessToken") },
          });
      
          if (response.data.message === "User deleted successfully") {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "User deleted successfully",
            });
            fetchData(); // Обновление данных после удаления
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to delete user",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete user",
          });
          console.error(error);
        }
      };

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Actions</th>
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