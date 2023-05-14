import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import swal from "sweetalert2";
import Swal from "sweetalert2";


function Post() {
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditingText, setIsEditingText] = useState(false);
  const [editedText, setEditedText] = useState(postObject.postText);
  const handleEditClick = () => {
    if (authState.username === postObject.username) {
      setEditedText(postObject.postText)
      setIsEditingText(true);
    }
  };
  const { authState } = useContext(AuthContext);

  let history = useHistory();

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/byId/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        if (response.data.error != undefined) {
          history.push("/login");
        }
        else {
          setPostObject(response.data);
        }
      });

    axios.get(`http://localhost:3001/comments/${id}`,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }).then((response) => {
        setComments(response.data);
      });
  }, []);

  const addComment = () => {
    if (newComment.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Comment cannot be empty",
      });
      return;
    }
    if (newComment.length != 0 && newComment.length <= 50) {
      axios
        .post(
          "http://localhost:3001/comments",
          {
            commentBody: newComment,
            PostId: id,
          },
          {
            headers: {
              accessToken: localStorage.getItem("accessToken"),
            },
          }
        )
        .then((response) => {
          if (response.data.error) {
            history.push("/login");
          } else {
            const commentToAdd = {
              id: response.data.id,
              commentBody: newComment,
              username: response.data.username,
            };
            comments.push(commentToAdd)
            setNewComment("");
          }
        });
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Comment should not exceed 50 characters',
      });
    }
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            return val.id != id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        history.push("/");
      });
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/posts/${id}/postText`,
        {
          newText: editedText,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setIsEditingText(false); // Exit the editing mode
      setPostObject({ ...postObject, postText: editedText });
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error;
        swal("Error", errorMessage, "error");
      } else {
        swal("Error", "An error occurred while updating the post text.", "error");
      }
    }
  };

  const handleCommentChange = (event) => {
    const value = event.target.value.trim(); // Remove leading and trailing whitespace
    if (value === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Empty values are not allowed",
      });
      return;
    }
    if (value.length <= 50) {
      setNewComment(value);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length > 300) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Text should not exceed 300 characters",
      });
      return;
    }
    if (newText.length < 10) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Text should be at least 10 characters long",
      });
      return;
    }
    setEditedText(newText);
  };

  const editPost = async (option) => {
    const newTitle = prompt("Enter New Title:");
  
    if (newTitle.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Title cannot be empty",
      });
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:3001/posts/${id}/title`,
        {
          newTitle: newTitle,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );
  
      setPostObject({ ...postObject, title: newTitle });
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error;
        Swal.fire("Error", errorMessage, "error");
      } else {
        Swal.fire("Error", "An error occurred while updating the post title.", "error");
      }
    }
  };

  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div>
            <div
              className="title"
              onClick={() => {
                if (authState.username === postObject.username) {
                  editPost();
                }
              }}
            >
              {postObject.title}
            </div>
          </div>

          {isEditingText ? (
            <div>
              <textarea
                className="body"
                value={editedText}
                onChange={handleTextChange}
                style={{ resize: "none", whiteSpace: "pre-wrap", width: "99%" }}
                rows={5}
              />
              <button onClick={handleSaveClick} disabled={!editedText.trim()}>Save</button>
            </div>
          ) : (
            <div
              className="body"
              onClick={handleEditClick}
              style={{ resize: "none", whiteSpace: "pre-wrap" }}
            >
              {postObject.postText}
            </div>
          )}
          <div className="footer">
            {postObject.username}
            {authState.username === postObject.username | authState.isAdmin && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                {" "}
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            autoComplete="off"
            required
            value={newComment}
            onChange={handleCommentChange}
          />
          <button onClick={addComment}> Add Comment</button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label> Username: {comment.username}</label>
                {(authState.username === comment.username | authState.isAdmin) && comment.id != undefined && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
