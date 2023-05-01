import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const MatchForm = () => {
    const { authState } = useContext(AuthContext);
    const [matchList, setMatchList] = useState([]);
    const [matchId, setMatchId] = useState({});
    const [goalsFirstTeam, setGoalsFirstTeam] = useState("");
    const [goalsSecondTeam, setGoalsSecondTeam] = useState("");
    let history = useHistory();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            console.log(localStorage.getItem("accessToken"))
            history.push("/login");
        } else {
            axios.get("http://localhost:3001/matches", {
                headers: { accessToken: localStorage.getItem("accessToken") },
            }).then((response) => {
                setMatchList(response.data);
            });
        }
    }, []);

    const initialValues = {
        goalsFirstTeam: 0,
        goalsSecondTeam: 0,
    };

    const validationSchema = Yup.object().shape({
        matchId: Yup.number().required(),
        goalsFirstTeam: Yup.number().required(),
        goalsSecondTeam: Yup.number().required(),
    });

    const onSubmit = (data) => {
        console.log(data)
        axios
            .put(`http://localhost:3001/matches/${data.matchId}`, data, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                console.log(response);
                history.push("/");
            });
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            <Form className="formContainer">
                <label>Match: </label>
                <ErrorMessage name="matchId" component="span"/>
                <Field as="select" name="matchId" >
                    <option value="">Select a match</option>
                    {matchList.map((match) => (
                        <option key={match.id} value={match.id} >
                            {match.id}
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

                <button type="submit"> Update match</button>
            </Form>
        </Formik>
    );
};

export default MatchForm;