import React, { useEffect, useState,useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../helpers/AuthContext";

function AddBooking() {
    const [tours, setTours] = useState([]);
    const { authState } = useContext(AuthContext);
    let history = useHistory();
    const initialValues = {
        tourId: 1,
        numberOfDays: 1
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            history.push("/login");
        }
        axios.get("https://course-project-75u9.onrender.com/tours/", {
            headers: { accessToken: localStorage.getItem("accessToken") },
        }).then((response) => {
            console.log(response.data)
            setTours(response.data);
        });
    }, []);
    const validationSchema = Yup.object().shape({
        tourId: Yup.number().required("Required"),
        numberOfDays: Yup.number().required("Required").min(1, "Минимальное значение – 1."),
    });

    const onSubmit = (data) => {
        const newData = {
            userId: authState.id,
            tourId: data.tourId,
            numberOfDays: data.numberOfDays
        }
        axios
            .post("https://course-project-75u9.onrender.com/bookings", newData, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Успех",
                        text: "Покупка совершена успешно",
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
                        text: "Не удалось совершить покупку",
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
                    <ErrorMessage name="tourId" component="span" />
                    <Field as="select" name="tourId">
                    <option value="">Выберите тур</option>
                        {tours.map((tour) => (
                            <option key={tour.id} value={tour.id}>
                                {tour.name}
                            </option>
                        ))}
                    </Field>
                    <label>Количество дней: </label>
                    <ErrorMessage name="priceOneDay" component="span" />
                    <Field
                        type="number"
                        id="inputCreatePost"
                        name="numberOfDays"
                        placeholder="100"
                    />
                    <button type="submit"> Купить тур</button>
                </Form>
            </Formik>
        </div>
    );
}

export default AddBooking;