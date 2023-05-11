import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  const [isTeamRelated, setIsTeamRelated] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teams, setTeams] = useState([]);

  let history = useHistory();
  const initialValues = {
    title: "",
    postText: "",
    relatedTeams: 0
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
    title: Yup.string().required("You must input a Title!"),
    postText: Yup.string().required(),
  });

  const handleTeamSelection = (event) => {
    setSelectedTeamId(event.target.value);
  };

  const onSubmit = (values, { resetForm }) => {
    const data = {
      title: values.title,
      postText: values.postText,
      teamId: selectedTeamId, // передаем связанные команды
    };
    axios
      .post("http://localhost:3001/posts", data, {
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
          />
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
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </Field>
            </div>
          )}

          <button type="submit"> Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
