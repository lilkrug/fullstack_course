import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const PlayerForm = () => {
    const { authState } = useContext(AuthContext);
    const [playerList, setPlayerList] = useState([]);
    const [playerId, setPlayerId] = useState({});
    
    let history = useHistory();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            console.log(localStorage.getItem("accessToken"))
            history.push("/login");
        } else {
            axios.get("http://localhost:3001/players/", {
                headers: { accessToken: localStorage.getItem("accessToken") },
            }).then((response) => {
                if (response.data.error != undefined) {
                    history.push("/login");
                }
                else {
                    setPlayerList(response.data.listOfPlayers);
                }
            });
        }
    }, []);

    const initialValues = {
        goals: 0,
        assists: 0,
    };

    const validationSchema = Yup.object().shape({
        playerId: Yup.number().integer().required(),
        goals: Yup.number().min(0).required(),
        assists: Yup.number().min(0).required(),
    });

    const onSubmit = (data) => {
        console.log(data)
        axios
            .put(`http://localhost:3001/players/${data.playerId}`, data, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then((response) => {
                console.log(response);
                history.push("/");
            });
    };

    return (
        <div>
            {playerList.length > 0 ? (
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}
                >
                    <Form className="formContainer">
                        <label>Player: </label>
                        <ErrorMessage name="playerId" component="span" />
                        <Field as="select" name="playerId" >
                            <option value="">Select a player</option>
                            {playerList.map((player) => (
                                <option key={player.id} value={player.id} >
                                    {player.name}
                                </option>
                            ))}
                        </Field>
                        <label>Goals: </label>
                        <ErrorMessage name="goals" component="span" />
                        <Field
                            autoComplete="off"
                            id="inputCreatePost"
                            name="goals"
                        />
                        <label>Assists: </label>
                        <ErrorMessage name="assists" component="span" />
                        <Field
                            autoComplete="off"
                            id="inputCreatePost"
                            name="assists"
                        />

                        <button type="submit"> Update player</button>
                    </Form>
                </Formik>
            ) :
                (
                    <h2>no players</h2>
                )
            }
        </div>
    );
};

export default PlayerForm;