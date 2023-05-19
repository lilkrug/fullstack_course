import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Formik, Form, Field } from "formik";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  let history = useHistory();

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(4, 'Пароль должен быть не менее 4 символов')
      .max(20, 'Пароль должен быть не более 20 символов')
      .required('Пароль является обязательным полем'),
    oldPassword: Yup.string()
      .required('Введите старый пароль'),
  });

  const changePassword = () => {
    axios.put(
      "https://course-project-75u9.onrender.com/auth/changepassword",
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
        Swal.fire({
          icon: "success",
          title: "Успех",
          text: "Пароль успешно изменен",
        })
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
      <Formik initialValues={{ oldPassword: '', newPassword: '' }} validationSchema={validationSchema}>
        <Form className="formContainer">
          <h1>Изменить свой пароль</h1>
          <ErrorMessage name="oldPassword" component="span" />
          <input
            type="password"
            name="oldPassword"
            placeholder="Старый пароль"
            onChange={(event) => {
              setOldPassword(event.target.value);
            }}
          />
          <ErrorMessage name="newPassword" component="span" />
          <input
            autoComplete="off"
            type="password"
            name="newPassword"
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
