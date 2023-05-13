import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import Swal from "sweetalert2";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  const [isTeamRelated, setIsTeamRelated] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teams, setTeams] = useState([]);

  let history = useHistory();
  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    }
    axios.get("http://localhost:3001/teams/teams", {
      headers: { accessToken: localStorage.getItem("accessToken") },
    }).then((response) => {
      setTeams(response.data);
    });
  }, []);
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must input a Title!").matches(/^\S+$/, "Whitespace is not allowed"),
    postText: Yup.string().required("You must input a text!").matches(/^\S+$/, "Whitespace is not allowed"),
  });

  const handleTeamSelection = (event) => {
    console.log(event.target.value)
    setSelectedTeamId(event.target.value);
  };

  const onSubmit = (values, { resetForm }) => {
    if (teams.length != 0) {
      setSelectedTeamId(teams[0].id)
    }
    const data = {
      title: values.title,
      postText: values.postText,
      teamId: isTeamRelated ? selectedTeamId : null, // передаем связанные команды
    };
    console.log(values)
    axios
      .post("http://localhost:3001/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data.error,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Post created successfully",
          }).then(() => {
            history.push("/");
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Internal server error",
        });
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
          <label>Title: </label>
          <ErrorMessage name="title" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
          />
          <label>Post: </label>
          <ErrorMessage name="postText" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
            style={{ width: "100%", height: "200px", resize: "none" }}
            component="textarea"
          />
          {teams.length != 0 && (
            <div>
              <label>
                <Field
                  type="checkbox"
                  name="isTeamRelated"
                  onClick={() => setIsTeamRelated(!isTeamRelated)}
                />
                Is related to team(s)?
              </label>
              {isTeamRelated && (
                <div>
                  <label>Related team(s):</label>
                  <Field as="select" name="relatedTeams" onChange={handleTeamSelection}>
                    {teams.length === 1 && (
                      <option value={teams[0].id}>{teams[0].name}</option>
                    )}
                    {teams.length > 1 && (
                      <>
                        <option value="">Select a team</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </>
                    )}
                  </Field>
                </div>
              )}
            </div>
          )}

          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
