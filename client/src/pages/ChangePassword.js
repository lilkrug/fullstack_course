import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  let history = useHistory();

  const changePassword = () => {
    axios.put(
      "http://localhost:3001/auth/changepassword",
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    )
      .then((response) => {
        history.push("/");
      })
      .catch((error) => {
        if (error.response) {
          const errorMessage = error.response.data.error;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonColor: '#3085d6',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Unexpected error occurred',
            text: error.message,
            confirmButtonColor: '#3085d6',
          });
        }
      });
  };

  return (
    <div>
      <h1>Change Your Password</h1>
      <input
        type="password"
        placeholder="Old Password..."
        onChange={(event) => {
          setOldPassword(event.target.value);
        }}
      />
      <input
        type="password"
        placeholder="New Password..."
        onChange={(event) => {
          setNewPassword(event.target.value);
        }}
      />
      <button onClick={changePassword}> Save Changes</button>
    </div>
  );
}

export default ChangePassword;
