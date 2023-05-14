import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Swal from "sweetalert2";

function CreateTeam() {
  const { authState } = useContext(AuthContext);

  let history = useHistory();
  const initialValues = {
    name: ""
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
  }, []);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("You must input a name!")
  });

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/teams", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }).
    then((response) => {
      history.push("/");
    })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.error;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
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
            placeholder="(Ex. Gazmyas)"
          />

          <button type="submit"> Create Team</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreateTeam;