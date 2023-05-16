

// import React, { useContext, useEffect, useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { useHistory } from "react-router-dom";
// import { AuthContext } from "../helpers/AuthContext";
// import Swal from "sweetalert2";

// function AddHotel() {
//     const { authState } = useContext(AuthContext);
//     const [cities, setCities] = useState([]);
//     let history = useHistory();
//     const initialValues = {
//         name: ""
//     };

//     useEffect(() => {
//         if (!localStorage.getItem("accessToken")) {
//             history.push("/login");
//         }
//         else {
//             axios.get('http://localhost:3001/cities', {
//                 headers: { accessToken: localStorage.getItem("accessToken") },
//             })
//                 .then(response => {
//                     if (response.data.error != undefined) {
//                         history.push("/login");
//                     }
//                     else {
//                         console.log(response.data)
//                         setCities(response.data);
//                     }
//                 })
//                 .catch(error => {
//                     console.log(error);
//                 });
//         }
//     }, []);
//     const validationSchema = Yup.object().shape({
//         // name: Yup.string().required("You must input a name!"),
//         // teamId: Yup.number().required("Please select a team"),
//         // fieldPositionId: Yup.number().required("Please select a field position"),
//     });

//     const onSubmit = (data) => {
//         console.log(data)
//         axios.post("http://localhost:3001/players/", data, {
//             headers: { accessToken: localStorage.getItem("accessToken") },
//         })
//             .then(response => {
//                 if (response.status === 200) {
//                     Swal.fire({
//                         icon: "success",
//                         title: "Success",
//                         text: "Player created successfully",
//                       }).then(() => {
//                         history.push("/");
//                       });
//                 }
//             })
//             .catch(error => {
//                 let errorMessage = 'An unexpected error occurred';
//                 if (error.response) {
//                     if (error.response.status === 400) {
//                         errorMessage = 'Missing parameters';
//                     } else if (error.response.status === 404) {
//                         if (error.response.data.error === "Position doesn't exist") {
//                             errorMessage = "Position doesn't exist";
//                         } else if (error.response.data.error === "Team doesn't exist") {
//                             errorMessage = "Team doesn't exist";
//                         }
//                     } else if (error.response.status === 409) {
//                         errorMessage = 'Player already exists';
//                     } else if (error.response.status === 500) {
//                         errorMessage = 'Internal server error';
//                     }
//                 }
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Error',
//                     text: errorMessage,
//                     confirmButtonColor: '#3085d6',
//                 });
//             });
//     };

//     return (
//         <div>{cities.length != 0 ? (
//             <div className="createPostPage">
//                 <Formik
//                     initialValues={initialValues}
//                     onSubmit={onSubmit}
//                     validationSchema={validationSchema}
//                 >
//                     <Form className="formContainer">
//                         <label>Name: </label>
//                         <ErrorMessage name="name" component="span" />
//                         <Field
//                             autoComplete="off"
//                             id="inputCreatePost"
//                             name="name"
//                             placeholder="(Ex. Shulakov Andrey)"
//                         />
//                         <ErrorMessage name="CityId" component="span" />
//                         <Field as="select" name="CityId">
//                             <option value="">Select a city</option>
//                             {cities.map((city) => (
//                                 <option key={city.id} value={city.id}>
//                                     {city.name}
//                                 </option>
//                             ))}
//                         </Field>
//                         <button type="submit"> Create Player</button>
//                     </Form>
//                 </Formik>
//             </div>
//         )
//             :
//             (
//                 <h1>no cities</h1>
//             )
//         }
//         </div>
//     );
// }

// export default AddHotel;



import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";



function AddHotel() {
    const [selectedCityId, setSelectedCityId] = useState(null);
    const [cities, setCities] = useState([]);
    let history = useHistory();
    const initialValues = {
        name: ""
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
        // relatedCity: Yup.number().required("Required"),
        starRating: Yup.number().required("Required").min(1, "Min value is 1").max(5, "Max value is 5"),
    });

    const onSubmit = (data) => {
        // console.log(values)
        // const data = {
        //     name: values.name,
        //     СityId: values.CityId,
        //     star_rating: values.stars
        // };
        console.log(data)
        axios
            .post("http://localhost:3001/hotels", data, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                if (response.data.error != undefined) {
                    history.push("/login");
                }
                else {
                    history.push("/");
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
                    <ErrorMessage name="CityId" component="span" />
                    <Field as="select" name="CityId">
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name="star_rating" component="span" />
                    <Field as="select" name="star_rating">
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


// function AddHotel() {
//     const { authState } = useContext(AuthContext);
//     const [selectedCityId, setSelectedCityId] = useState(null);
//     const [cities, setCities] = useState([]);
//     let history = useHistory();
//     const initialValues = {
//         name: "",
//     };

//     useEffect(() => {
//         if (!localStorage.getItem("accessToken")) {
//             history.push("/login");
//         }
//         axios.get("http://localhost:3001/cities/", {
//             headers: { accessToken: localStorage.getItem("accessToken") },
//         }).then(response => {
//             if (response.data.error != undefined) {
//                 history.push("/login");
//             }
//             else {
//                 console.log(response.data)
//                 setCities(response.data);
//             }
//         })
//             .catch(error => {
//                 console.log(error);
//             });
//     }, []);
//     const validationSchema = Yup.object().shape({
//         name: Yup.string().required("You must input a Title!"),
//         relatedCity: Yup.string().required("Required"),
//         stars: Yup.number().required("Required").min(1, "Min value is 1").max(5, "Max value is 5"),
//     });

//     const onSubmit = (data) => {
//         console.log(data)
//         axios
//             .post("http://localhost:3001/hotels", data, {
//                 headers: { accessToken: localStorage.getItem("accessToken") },
//             })
//             .then((response) => {
//                 if (response.data.error != undefined) {
//                     history.push("/login");
//                 }
//                 else {
//                     history.push("/");
//                 }
//             });
//     };

//     return (
//         <div className="createPostPage">
//             <Formik
//                 initialValues={initialValues}
//                 onSubmit={onSubmit}
//             >
//                 <Form className="formContainer">
//                     <label>Name: </label>
//                     <ErrorMessage name="name" component="span" />
//                     <Field
//                         autoComplete="off"
//                         id="inputCreatePost"
//                         name="name"
//                         placeholder="(Столбцы)"
//                     />
//                     <ErrorMessage name="CityId" component="span" />
//                     <Field as="select" name="CityId">
//                         <option value="">Select a City</option>
//                         {cities.map((city) => (
//                             <option key={city.id} value={city.id}>
//                                 {city.name}
//                             </option>
//                         ))}
//                     </Field>
//                     <ErrorMessage name="stars" component="span" />
//                     <Field as="select" name="stars">
//                         <option value="">Select Stars</option>
//                         <option value={1}>1</option>
//                         <option value={2}>2</option>
//                         <option value={3}>3</option>
//                         <option value={4}>4</option>
//                         <option value={5}>5</option>
//                     </Field>
//                     <button type="submit"> Add Hotel</button>
//                 </Form>
//             </Formik>
//         </div>
//     );
// }

// export default AddHotel;
