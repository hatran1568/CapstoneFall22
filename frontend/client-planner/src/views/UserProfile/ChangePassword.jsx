import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBContainer,
  MDBInput,
} from "mdb-react-ui-kit";
import { React, useEffect, useState } from "react";
import axios from "../../api/axios";
import style from "./changePassword.module.css";
import { message } from "antd";
function ChangePassword() {
  const [avatar, setAvatar] = useState();
  const [user, setUser] = useState({
    id: localStorage.getItem("id"),
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePwd = () => {
    axios
      .post("/api/user/edit-password", user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status == 400) {
          console.log("wrong password");
        }
        if (response.status == 200) {
          message.success("Password changed successfully!");
        }
      });
  };
  return (
    <MDBContainer className={style.container}>
      <MDBCard alignment="center" style={{ marginTop: "50px" }}>
        <MDBCardBody>
          <MDBCardTitle className="my-4">Change password</MDBCardTitle>
          <div
            className={` d-flex flex-column justify-content-center align-items-center`}
          >
            <div className={style.btn}>
              <img
                className={`${style.avatar}`}
                src={avatar ? avatar : "http://www.gravatar.com/avatar/?d=mp"}
              />
            </div>
            <h6>Username</h6>
          </div>
          <form>
            <MDBInput
              wrapperClass="my-4 mx-5"
              type="password"
              id="oldpwd"
              label="Old password"
              onChange={(e) =>
                setUser({ ...user, oldPassword: e.target.value })
              }
            />

            <MDBInput
              wrapperClass="mb-4 mx-5"
              type="password"
              id="newpwd"
              label="New password"
              onChange={(e) =>
                setUser({ ...user, newPassword: e.target.value })
              }
            />
            <MDBInput
              wrapperClass="mb-4 mx-5"
              type="password"
              id="confirmpwd"
              label="Confirm new password"
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
            />
            <MDBBtn className="mb-4" type="button" onClick={handleChangePwd}>
              Change password
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default ChangePassword;
