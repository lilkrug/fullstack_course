import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Swal from "sweetalert2";

function AddCity() {
  const { authState } = useContext(AuthContext);

  let history = useHistory();
  const initialValues = {
    name: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("You must input a Name!"),
  });


  const onSubmit = (data) => {
    axios.post("http://localhost:3001/cities/", data, {
      headers: { accessToken: localStorage.getItem("accessToken") },
    })
      .then(response => {
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "City added successfully",
          }).then(() => {
            history.push("/");
          });
        }
      })
      .catch(error => {
        let errorMessage = 'An unexpected error occurred';
        if (error.response) {
          if (error.response.status === 400) {
            errorMessage = 'Missing parameters';
          } else if (error.response.status === 409) {
            errorMessage = 'City already added';
          } else if (error.response.status === 500) {
            errorMessage = 'Internal server error';
          }
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#3085d6',
        });
      });
  };

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Name: </label>
          <ErrorMessage name="name" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="name"
            placeholder="(Столбцы)"
          />
          <button type="submit"> Add City</button>
        </Form>
      </Formik>
    </div>
  );
}

export default AddCity;
