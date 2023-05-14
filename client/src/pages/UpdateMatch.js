import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const MatchForm = () => {
    const { authState } = useContext(AuthContext);
    const [matchList, setMatchList] = useState([]);
    const [matchId, setMatchId] = useState({});
    const [goalsFirstTeam, setGoalsFirstTeam] = useState("");
    const [goalsSecondTeam, setGoalsSecondTeam] = useState("");

    let history = useHistory();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            Swal.fire({
                icon: 'error',
                title: 'Unauthorized',
                text: 'User not logged in',
                confirmButtonColor: '#3085d6',
            }).then(() => {
                history.push("/login");
            });
        } else {
            axios
                .get("http://localhost:3001/matches/withoutScore", {
                    headers: { accessToken: localStorage.getItem("accessToken") },
                })
                .then((response) => {
                    if (response.data.error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Unauthorized',
                            text: response.data.error,
                            confirmButtonColor: '#3085d6',
                        }).then(() => {
                            history.push("/login");
                        });
                    } else {
                        console.log(response.data);
                        setMatchList(response.data);
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Unexpected error occurred',
                        text: error.message,
                        confirmButtonColor: '#3085d6',
                    }).then(() => {
                        history.push("/login");
                    });
                });
        }
    }, []);

    const initialValues = {
        goalsFirstTeam: 0,
        goalsSecondTeam: 0,
    };

    const validationSchema = Yup.object().shape({
        matchId: Yup.number().integer().required(),
        goalsFirstTeam: Yup.number().min(0).required(),
        goalsSecondTeam: Yup.number().min(0).required(),
        numberOfPassesFirstTeam: Yup.number().integer().required(),
        numberOfPassesSecondTeam: Yup.number().integer().required(),
        numberOfCornersFirstTeam: Yup.number().min(0).required(),
        numberOfCornersSecondTeam: Yup.number().min(0).required(),
    });

    const onSubmit = (data) => {
        console.log(data);
        axios
            .put(`http://localhost:3001/matches/${data.matchId}`, data, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                console.log(response);
                Swal.fire({
                    icon: 'success',
                    title: 'Match updated successfully',
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    history.push("/");
                });
            })
            .catch((error) => {
                console.error(error);
                let errorMessage = "Unexpected error occurred";
                if (error.response && error.response.data) {
                    errorMessage = error.response.data;
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
        <div>
            {matchList.length > 0 ? (
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    <Form className="formContainer">
                        <label>Match: </label>
                        <ErrorMessage name="matchId" component="span" />
                        <Field as="select" name="matchId" >
                            <option value="">Select a match</option>
                            {matchList.map((match) => (
                                <option key={match.id} value={match.id} >
                                    {match.firstTeam.name}-{match.secondTeam.name} {match.dateTime}
                                </option>
                            ))}
                        </Field>
                        <label>Goals first team: </label>
                        <ErrorMessage name="goalsFirstTeam" component="span" />
                        <Field
                            autoComplete="off"
                            id="inputCreatePost"
                            name="goalsFirstTeam"
                            placeholder="(Ex. first goal...)"
                        />
                        <label>Goals second team: </label>
                        <ErrorMessage name="goalsSecondTeam" component="span" />
                        <Field
                            autoComplete="off"
                            id="inputCreatePost"
                            name="goalsSecondTeam"
                            placeholder="(Ex. second goal...)"
                        />
                        <ErrorMessage name="numberOfPassesFirstTeam" component="span" />
                        <Field
                            autoComplete="off"
                            id="inputCreatePost"
                            name="numberOfPassesFirstTeam"
                            placeholder="(Ex. second goal...)"
                        />
                        <ErrorMessage name="numberOfPassesSecondTeam" component="span" />
                        <Field
                            autoComplete="off"
                            id="inputCreatePost"
                            name="numberOfPassesSecondTeam"
                            placeholder="(Ex. second goal...)"
                        />
                        <ErrorMessage name="numberOfCornersFirstTeam" component="span" />
                        <Field
                            autoComplete="off"
                            id="inputCreatePost"
                            name="numberOfCornersFirstTeam"
                            placeholder="(Ex. second goal...)"
                        />
                        <ErrorMessage name="numberOfCornersSecondTeam" component="span" />
                        <Field
                            autoComplete="off"
                            id="inputCreatePost"
                            name="numberOfCornersSecondTeam"
                            placeholder="(Ex. second goal...)"
                        />

                        <button type="submit"> Update match</button>
                    </Form>
                </Formik>
            ) :
                (
                    <h2>no matches</h2>
                )
            }
        </div>
    );
};

export default MatchForm;