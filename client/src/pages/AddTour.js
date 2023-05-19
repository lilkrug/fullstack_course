import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";


function AddTour() {
    const [hotels, setHotels] = useState([]);
    let history = useHistory();
    const initialValues = {
        name: "",
        priceOneDay: 100
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            history.push("/login");
        }
        axios.get("https://course-project-75u9.onrender.com/hotels/", {
            headers: { accessToken: localStorage.getItem("accessToken") },
        }).then((response) => {
            console.log(response.data)
            setHotels(response.data);
        }).catch((error) => {
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
          });;
    }, []);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Вы должны ввести название!"),
        hotelId: Yup.number().required("Необходимо выбрать отель"),
        priceOneDay: Yup.number().required("Выбрать цену").min(1, "Минимальное значение – 10."),
    });

    const onSubmit = (data) => {
        console.log(data);
        axios
            .post("https://course-project-75u9.onrender.com/tours", data, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Успех",
                        text: "Тур успешно добавлен",
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
                    });
                } else if (error.response.status === 409) {
                    Swal.fire({
                        icon: "error",
                        title: "Ошибка",
                        text: errorMessage,
                    });
                }
                else if (error.response.status === 404) {
                    Swal.fire({
                        icon: "error",
                        title: "Ошибка",
                        text: errorMessage,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Ошибка",
                        text: "Не удалось создать тур.",
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
                    <label>Название тура: </label>
                    <ErrorMessage name="name" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="name"
                        placeholder="Египет"
                    />
                    <label>Отель: </label>
                    <ErrorMessage name="hotelId" component="span" />
                    <Field as="select" name="hotelId">
                        <option value="">Выберите отель</option>
                        {hotels.map((hotel) => (
                            <option key={hotel.id} value={hotel.id}>
                                {hotel.name}
                            </option>
                        ))}
                    </Field>
                    <label>Цена в день: </label>
                    <ErrorMessage name="priceOneDay" component="span" />
                    <Field
                        type="number"
                        id="inputCreatePost"
                        name="priceOneDay"
                        placeholder="100"
                    />
                    <button type="submit"> Добавить тур</button>
                </Form>
            </Formik>
        </div>
    );
}

export default AddTour;