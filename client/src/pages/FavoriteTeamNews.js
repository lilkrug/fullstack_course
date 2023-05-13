import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";



function Home() {
    let { id } = useParams();
    const [listOfPosts, setListOfPosts] = useState([]);
    const { authState } = useContext(AuthContext);
    let history = useHistory();

    useEffect(() => {
        console.log(localStorage.getItem("accessToken"))
        if (!localStorage.getItem("accessToken")) {
            console.log(localStorage.getItem("accessToken"))
            history.push("/login");
        } else {
            axios
                .get(`http://localhost:3001/posts/byteamId/${id}`, {
                    headers: { accessToken: localStorage.getItem("accessToken") },
                })
                .then((response) => {
                    console.log(response.data)
                    if (response.data.error != undefined) {
                        localStorage.removeItem("accessToken")
                        history.push("/login");
                    }
                    else {
                        setListOfPosts(response.data);
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
            });
    };

    return (
        <div>
            {listOfPosts.length != 0 ? (
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
                                        />

                                        <label> {value.Likes.length}</label>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )
            :
            (
                <h1>Нет новостей к этой команде</h1>
            )
            }
        </div>
    );
}

export default Home;
