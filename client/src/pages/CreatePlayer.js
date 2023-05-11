import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePlayer() {
    const { authState } = useContext(AuthContext);
    const [teams, setTeams] = useState([]);
    const [fieldPositions, setFieldPositions] = useState([]);
    let history = useHistory();
    const initialValues = {
        name: ""
    };

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            history.push("/login");
        }
        else {
            axios.get('http://localhost:3001/teams/teams', {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
                .then(response => {
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        console.log(response.data)
                        setTeams(response.data);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            axios.get('http://localhost:3001/fieldPositions/', {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
                .then(response => {
                    if (response.data.error != undefined) {
                        history.push("/login");
                    }
                    else {
                        console.log(response.data)
                        setFieldPositions(response.data.listOfPositions);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, []);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("You must input a name!"),
        fieldNumber: Yup.string().required("You must input a fieldNumber!")
    });

    const onSubmit = (data) => {
        console.log(data)
        axios
            .post("http://localhost:3001/players", data, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                console.log(response)
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
                        placeholder="(Ex. Shulakov Andrey)"
                    />
                    <ErrorMessage name="fieldNumber" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="fieldNumber"
                        placeholder="(Ex. 69)"
                    />
                    <Field as="select" name="teamId">
                        <option value="">Select a team</option>
                        {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </Field>
                    <br/>
                    
                    <Field as="select" name="fieldPositionId">
                        <option value="">Select a field position</option>
                        {fieldPositions.map((fieldPosition) => (
                            <option key={fieldPosition.id} value={fieldPosition.id}>
                                {fieldPosition.name}
                            </option>
                        ))}
                    </Field>
                    <button type="submit"> Create Player</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreatePlayer;
