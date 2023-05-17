import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";


function AddHotel() {
    const [selectedCityId, setSelectedCityId] = useState(null);
    const [cities, setCities] = useState([]);
    let history = useHistory();
    const initialValues = {
        name: "",
        cityId: 1,
        starRating: 1
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            history.push("/login");
        }
        axios.get("http://localhost:3001/cities/", {
            headers: { accessToken: localStorage.getItem("accessToken") },
        }).then((response) => {
            console.log(response.data)
            setCities(response.data);
        });
    }, []);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("You must input a Title!"),
        cityId: Yup.number().required("Required"),
        starRating: Yup.number().required("Required").min(1, "Min value is 1").max(5, "Max value is 5"),
    });

    const onSubmit = (data) => {
        console.log(data);
        axios
            .post("http://localhost:3001/hotels", data, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                const errorMessage = response.data.error;
                if (response.status === 200) {
                    Swal.fire({
                      icon: "success",
                      title: "Success",
                      text: "Hotel added successfully",
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
                        title: "Error",
                        text: errorMessage,
                    });
                } else if (error.response.status === 409) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: errorMessage,
                    });
                }
                else if (error.response.status === 404) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: errorMessage,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to create hotel",
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
                        placeholder="(Столбцы)"
                    />
                    <ErrorMessage name="cityId" component="span" />
                    <Field as="select" name="cityId">
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name="starRating" component="span" />
                    <Field as="select" name="starRating">
                        <option value="">Select Stars</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </Field>
                    <button type="submit"> Add Hotel</button>
                </Form>
            </Formik>
        </div>
    );
}

export default AddHotel;