import React, { useState, useContext } from "react";
import axios from "axios";
import { Formik, Form} from "formik";
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
    axios.post("https://course-project-75u9.onrender.com/auth/login", data)
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
            title: 'Пользователь уже создан',
            confirmButtonColor: '#fe6401',
          });
        } else if (error.response && error.response.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Неверная комбинация имени пользователя и пароля',
            confirmButtonColor: '#fe6401',
          });
        } else if (error.response && error.response.status === 404) {
          Swal.fire({
            icon: 'error',
            title: 'Пользователь не существует',
            confirmButtonColor: '#fe6401',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Произошла непредвиденная ошибка',
            text: error.message,
            confirmButtonColor: '#fe6401',
          });
        }
      });
  };
  return (
    <div className="loginContainer">
      <Formik>
      <Form className="formContainer">
      <h1>Авторизация</h1>
      <label>Имя пользователя:</label>
      <input
        type="text"
        placeholder="Введите имя"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Пароль:</label>
      <input
        type="password"
        placeholder="Введите пароль"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button onClick={login}> Авторизоваться </button>
      </Form>
    </Formik>
    </div>
  );
}

export default Login;
