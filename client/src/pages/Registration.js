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
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  const onSubmit = (data) => {
    axios.post("http://localhost:3001/auth", data)
      .then((response) => {
        // Обработка успешного ответа
        console.log("Registration successful");
        history.push('/login');
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'User is already created',
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
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Username: </label>
          <ErrorMessage name="username" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="username"
            placeholder="(Ex. John123...)"
          />

          <label>Password: </label>
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="Your Password..."
          />

          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
