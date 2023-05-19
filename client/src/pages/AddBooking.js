import React, { useEffect, useState, useContext } from "react";
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
        fromDate: "",
        toDate: "",
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
        fromDate: Yup.date()
          .min(new Date(), "Дата начала не может быть раньше завтра")
          .test({
            name: "fromDate",
            exclusive: false,
            message: "Дата начала не может быть позже даты окончания",
            test: function (value) {
              const { toDate } = this.parent;
              return !toDate || value <= toDate;
            },
          }),
      
        toDate: Yup.date()
          .min(new Date(), "Дата окончания не может быть раньше завтра")
          .test({
            name: "toDate",
            exclusive: false,
            message: "Дата окончания не может быть раньше даты начала",
            test: function (value) {
              const { fromDate } = this.parent;
              return !fromDate || value >= fromDate;
            },
          }),
      });

    const onSubmit = (data) => {
        const newData = {
            userId: authState.id,
            tourId: data.tourId,
            fromDate: data.fromDate,
            toDate: data.toDate,
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
                        text: "Не удалось совершить покупку",
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
                    <ErrorMessage name="tourId" component="span" />
                    <Field as="select" name="tourId">
                        <option value="">Выберите тур</option>
                        {tours.map((tour) => (
                            <option key={tour.id} value={tour.id}>
                                {tour.name}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name="fromDate" component="span" className="error" />
                    <label>Дата начала:</label>
                    <Field type="date" name="fromDate" className="inputCreatePost" />
                    <ErrorMessage name="toDate" component="span" className="error" />
                    <label>Дата окончания:</label>
                    <Field type="date" name="toDate" className="inputCreatePost" />
                    <button type="submit"> Купить тур</button>
                </Form>
            </Formik>
        </div>
    );
}

export default AddBooking;