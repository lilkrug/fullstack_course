import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import swal from "sweetalert2";
function Profile() {
  let { id } = useParams();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [ListOfPostsFavorite, setListOfPostsFavorite] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [favoriteTeam, setFavoriteTeam] = useState(null);
  const [favoriteTeamId, setFavoriteTeamId] = useState(null);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/basicinfo/${id}`, {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        console.log('asdasd')
        console.log(response.data); 
        if (response.data==null) {
          setUsername(null);
        } else {
          setUsername(response.data.username);
          setFavoriteTeamId(response.data.favoriteTeamId);
        }
      })
      .catch((error) => {
      });

    axios
      .get(`http://localhost:3001/teams/getfavoriteteam/${id}`, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        const teamName = response.data;
        setFavoriteTeam(teamName === null ? null : teamName);
        console.log('status')
        console.log(response.status)
        if (response.status === 404) {
          history.push("/login");
        }
      })
      .catch((error) => {
        
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
      console.log(response.data)
      setTeamList(response.data);
    });
  }, []);

  const handleTeamSelection = (e) => {
    setSelectedTeam(e.target.value);
  };

  const handleFavoriteTeamSubmit = () => {
    if (selectedTeam) {
      axios
        .put(`http://localhost:3001/teams/setfavoriteteam`, {
          favoriteTeamId: selectedTeam,
          userId: authState.id
        }, {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        })
        .then((response) => {
          console.log(response);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
          swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update favorite team',
          });
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
            < h2 > Favorite Team: {favoriteTeam}</h2>
          )
          }
          {favoriteTeam != null && (
            <button
              onClick={() => {
                history.push(`/postsByTeam/${favoriteTeamId}`);
              }}
            >
              {" "}
              Check favorite team news
            </button>
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
        <div className="grid-container">
          {listOfPosts.length != 0 && (
            <div>
              <div className="section-header">
                <h1>Your Posts</h1>
              </div>
              <div className="posts-container">
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
          )}
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
