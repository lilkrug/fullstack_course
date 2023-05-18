import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

function Registration() {
  let history = useHistory();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
    .min(3, 'Имя пользователя должно быть не менее 3 символов')
    .max(15, 'Имя пользователя должно быть не более 15 символов')
    .required('Имя пользователя является обязательным полем'),
    password: Yup.string()
    .min(4, 'Пароль должен быть не менее 4 символов')
    .max(20, 'Пароль должен быть не более 20 символов')
    .required('Пароль является обязательным полем'),
  });

  const onSubmit = (data) => {
    axios.post("https://course-project-75u9.onrender.com/auth", data)
      .then((response) => {
        // Обработка успешного ответа
        console.log("Registration successful");
        history.push('/login');
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Пользователь уже создан',
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
    <div className="registr-page">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <h1>Регистрация</h1>
          <label>Имя пользователя: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="username"
            placeholder="(alexxx111)"
          />

          <label>Пароль: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="пароль"
          />

          <button type="submit">Зарегистрироваться</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
