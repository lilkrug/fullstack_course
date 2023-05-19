import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";


function AddHotel() {
    let history = useHistory();
    const initialValues = {
        name: "",
        city: "",
        starRating: 1
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            history.push("/login");
        }
    }, []);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Вы должны ввести название!"),
        city: Yup.string().required("Вы должны ввести город!"),
        starRating: Yup.number().required("Необходимо выбрать звезду").min(1, "Минимальное значение – 1.").max(5, "Максимальное значение - 5"),
    });

    const onSubmit = (data) => {
        console.log(data);
        axios
            .post("https://course-project-75u9.onrender.com/hotels", data, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                const errorMessage = response.data.error;
                if (response.status === 200) {
                    Swal.fire({
                      icon: "success",
                      title: "Успех",
                      text: "Отель успешно добавлен",
                      confirmButtonColor: '#fe6401',
                    }).then(() => {
                      history.push("/");
                    });
                  }
            })
            .catch((error) => {
                const errorMessage = error.response.data.error;
                console.log(error)
                if (error.response.status === 400) {
                    Swal.fire({
                        icon: "error",
                        title: "Ошибка",
                        text: errorMessage,
                        confirmButtonColor: '#fe6401',
                    });
                } else if (error.response.status === 409) {
                    Swal.fire({
                        icon: "error",
                        title: "Ошибка",
                        text: errorMessage,
                        confirmButtonColor: '#fe6401',
                    });
                }
                else if (error.response.status === 404) {
                    Swal.fire({
                        icon: "error",
                        title: "Ошибка",
                        text: errorMessage,
                        confirmButtonColor: '#fe6401',
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Ошибка",
                        text: "Не удалось создать отель",
                        confirmButtonColor: '#fe6401',
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
                    <label>Название: </label>
                    <ErrorMessage name="name" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="name"
                        placeholder="(SuperHotel)"
                    />
                    <ErrorMessage name="city" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="city"
                        placeholder="(Столбцы)"
                    />
                    <ErrorMessage name="starRating" component="span" />
                    <Field as="select" name="starRating">
                        <option value="">Выберите звезды</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </Field>
                    <button type="submit"> Добавить Отель </button>
                </Form>
            </Formik>
        </div>
    );
}

export default AddHotel;