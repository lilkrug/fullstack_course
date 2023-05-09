import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";



function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [matches, setMatches] = useState([]);
  const { authState } = useContext(AuthContext);
  let history = useHistory();

  useEffect(() => {
    console.log(localStorage.getItem("accessToken"))
    if (!localStorage.getItem("accessToken")) {
      console.log(localStorage.getItem("accessToken"))
      history.push("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          console.log(response.data)
          if (response.data.error != undefined) {
            localStorage.removeItem("accessToken")
            history.push("/login");
          }
          else {
            setListOfPosts(response.data.listOfPosts);
            setLikedPosts(
              response.data.likedPosts.map((like) => {
                return like.PostId;
              })
            );
          }
        });
        axios
        .get("http://localhost:3001/matches/today", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          console.log(response.data)
          if (response.data.error != undefined) {
            localStorage.removeItem("accessToken")
            history.push("/login");
          }
          else {
            setMatches(response.data);
          }
        });
    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        "http://localhost:3001/likes",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id != postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
      <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Команда 1</th>
          <th>Команда 2</th>
        </tr>
      </thead>
      <tbody>
        {matches.map((match, index) => (
          <tr key={index}>
            <td>{new Date(match.dateTime).toLocaleTimeString()}</td>
            <td>{match.firstTeam.name}</td>
            <td>{match.secondTeam.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
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
              <div className="username">
                <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
              </div>
              <div className="buttons">
                <ThumbUpAltIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />

                <label> {value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
