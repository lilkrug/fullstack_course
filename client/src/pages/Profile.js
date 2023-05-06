import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        console.log(response.data.error)
        if (response.data.error != undefined) {
          history.push("/login");
        }
        else {
          setUsername(response.data.username);
          console.log('suka')
          console.log(response.data.username)
          console.log(response.data.username==null)
        }
      });

    axios.get(`http://localhost:3001/posts/byuserId/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        setListOfPosts(response.data);
      });
  }, []);

  return (
    <div>
      {username!=null ? (<div className="profilePageContainer">
        <div className="basicInfo">
          {" "}
          <h1> Username: {username} </h1>
          {authState.username === username && (
            <button
              onClick={() => {
                history.push("/changepassword");
              }}
            >
              {" "}
              Change My Password
            </button>
          )}
        </div>
        <div className="listOfPosts">
          {listOfPosts.map((value, key) => {
            return (
              <div key={key} className="post">
                <div className="title"> {value.title} </div>
                <div
                  className="body"
                  onClick={() => {
                    history.push(`/post/${value.id}`);
                  }}
                >
                  {value.postText}
                </div>
                <div className="footer">
                  <div className="username">{value.username}</div>
                  <div className="buttons">
                    <label> {value.Likes.length}</label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )
      :
      (
        <h2>There is no such user</h2>
      )
      }
    </div>
  );
}

export default Profile;
