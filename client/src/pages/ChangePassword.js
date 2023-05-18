import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Form} from "formik";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  let history = useHistory();

  const changePassword = () => {
    axios.put(
      "http://localhost:3001/auth/changepassword",
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    )
      .then((response) => {
        history.push("/");
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.error;
          Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: errorMessage,
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
    <div className="ChangePassword-page">
      <Formik>
        <Form className="formContainer">
      <h1>Изменить свой пароль</h1>
      <input
        type="password"
        placeholder="Старый пароль"
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Новый пароль"
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
      <button onClick={changePassword}> Сохранить изменения </button>
      </Form>
      </Formik>
    </div>
  );
}

export default ChangePassword;
