import React, { useState, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Swal from "sweetalert2";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);

  let history = useHistory();

  const login = () => {
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data)
      .then((response) => {
        localStorage.setItem("accessToken", response.data.token);
        localStorage.setItem("isAdmin", response.data.isAdmin);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
          isAdmin: response.data.isAdmin
        });
        history.push("/");
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'User is already created',
            confirmButtonColor: '#3085d6',
          });
        } else if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Wrong Username and Password combination',
            confirmButtonColor: '#3085d6',
          });
        } else if (error.response && error.response.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'User doesn\'t exist',
            confirmButtonColor: '#3085d6',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Unexpected error occurred',
            text: error.message,
            confirmButtonColor: '#3085d6',
          });
        }
      });
  };
  return (
    <div className="loginContainer">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}> Login </button>
    </div>
  );
}

export default Login;
