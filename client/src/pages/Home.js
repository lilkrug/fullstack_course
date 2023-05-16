import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";
import Swal from "sweetalert2";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  let history = useHistory();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'User not logged in!',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        localStorage.removeItem("accessToken");
        history.push("/login");
      });
    } else {
      // axios
      //   .get("http://localhost:3001/posts", {
      //     headers: { accessToken: localStorage.getItem("accessToken") },
      //   })
      //   .then((response) => {
      //     if (response.status === 401) {
      //       Swal.fire({
      //         icon: 'error',
      //         title: 'Unauthorized',
      //         text: 'Token has expired',
      //         confirmButtonColor: '#3085d6',
      //       }).then(() => {
      //         localStorage.removeItem("accessToken");
      //         history.push("/login");
      //       });
      //     } else if (response.data.error != undefined) {
      //       Swal.fire({
      //         icon: 'error',
      //         title: 'Error',
      //         text: response.data.error,
      //         confirmButtonColor: '#3085d6',
      //       }).then(() => {
      //         localStorage.removeItem("accessToken");
      //         history.push("/login");
      //       });
      //     } else {
      //       setListOfPosts(response.data.listOfPosts);
      //       setLikedPosts(
      //         response.data.likedPosts.map((like) => {
      //           return like.PostId;
      //         })
      //       );
      //     }
      //   })
      //   .catch((error) => {
      //     Swal.fire({
      //       icon: 'error',
      //       title: 'Unexpected error occurred',
      //       text: error.message,
      //       confirmButtonColor: '#3085d6',
      //     }).then(() => {
      //       localStorage.removeItem("accessToken");
      //       history.push("/login");
      //     });
      //   });
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
