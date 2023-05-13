import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

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
    if (newComment.length != 0) {
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
            console.log(response.data.error);
          } else {
            console.log(response)
            const commentToAdd = {
              id: response.data.id,
              commentBody: newComment,
              username: response.data.username,
            };
            //setComments([...comments, commentToAdd]);
            comments.push(commentToAdd)
            setNewComment("");
            console.log(comments)
          }
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
        "http://localhost:3001/posts/postText",
        {
          newText: editedText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      // Handle the response as needed
      console.log(response.data);

      setIsEditingText(false); // Exit the editing mode
      setPostObject({ ...postObject, postText: editedText });
    } catch (error) {
      // Handle any error that occurred during the PUT request
      console.log(error);
    }
  };

  const editPost = (option) => {
    if (option === "title") {
      let newTitle = prompt("Enter New Title:");
      axios.put(
        "http://localhost:3001/posts/title",
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter New Text:");
      axios.put(
        "http://localhost:3001/posts/postText",
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      );

      setPostObject({ ...postObject, postText: newPostText });
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
                  editPost("title");
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
                onChange={(e) => setEditedText(e.target.value.slice(0, 300))}
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
            onChange={(event) => {
              console.log(event.target.value)
              if (event.target.value != null) {
                setNewComment(event.target.value);
              }
            }}
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
