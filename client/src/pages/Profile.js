import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [favoriteTeam, setFavoriteTeam] = useState(null);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        if (response.data.error != undefined) {
          history.push("/login");
        }
        else {
          setUsername(response.data.username);
        }
      });

    axios.get(`http://localhost:3001/teams/getfavoriteteam/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        console.log(response.data)
        if (response.data != null) {
          if (response.data.error != undefined) {
            history.push("/login");
          }
          else {
            setFavoriteTeam(response.data);
          }
        }
      });

    axios.get(`http://localhost:3001/posts/byteamId/${authState.id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        console.log('baza')
        console.log(authState)
        console.log(response.data)
      });

    axios.get(`http://localhost:3001/posts/byuserId/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        setListOfPosts(response.data);
      });

    axios.get(`http://localhost:3001/teams/teams`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      setTeamList(response.data);
    });
  }, []);

  const handleTeamSelection = (e) => {
    setSelectedTeam(e.target.value);
  };

  const handleFavoriteTeamSubmit = () => {
    if (selectedTeam) {
      axios.put(`http://localhost:3001/teams/setfavoriteteam`, {
        favoriteTeamId: selectedTeam,
        userId: authState.id
      }, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        console.log(response);
      });
    }
  };

  return (
    <div>
      {username != null ? (<div className="profilePageContainer">
        <div className="basicInfo">
          {" "}
          <h1> Username: {username} </h1>
          {favoriteTeam != null && (
            < h2 > Favorite Team: {favoriteTeam.name}</h2>
          )
          }
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
        {teamList.length != 0 && (
          <div className="favoriteTeamForm">
            <h2>Choose your favorite team:</h2>
            <select onChange={handleTeamSelection}>
              <option value="">--Select team--</option>
              {teamList.map((team) => {
                return (
                  <option key={team.id} value={team.id}>{team.name}</option>
                );
              })}
            </select>
            <button onClick={handleFavoriteTeamSubmit}>Submit</button>
          </div>
        )
        }
        <div>
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
    </div >
  );
}

export default Profile;
