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
  const [errMsg, setErrMsg] = useState("");
  const [curUser, setCurUser] = useState();
  const [user, setUser] = useState({
    id: localStorage.getItem("id"),
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePwd = () => {
    if (
      user.oldPassword == null ||
      user.newPassword == null ||
      user.confirmPassword == null
    ) {
      setErrMsg("Please enter all fields");
    } else if (user.newPassword != user.confirmPassword) {
      setErrMsg("New password and confirm password doesn't match");
    } else {
      axios
        .post("/user/api/user/edit-password", user, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .catch((err) => {
          if (err.response.status == 400) {
            setErrMsg("Wrong password!");
          }
        })
        .then((response) => {
          if (response.status == 200) {
            message.success("Password changed successfully!");
            window.location.href = "http://localhost:3000/";
          }
        });
    }
  };

  useEffect(() => {
    async function getUserProfile() {
      const response = await axios.get("/user/api/user/findById/" + user.id, {
        headers: { "Content-Type": "application/json" },
      });

      setCurUser(response.data);
    }

    document.title = "Change password | Tripplanner";
    getUserProfile();
  }, []);

  return curUser ? (
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
                src={
                  curUser.avatar
                    ? curUser.avatar
                    : "http://www.gravatar.com/avatar/?d=mp"
                }
              />
            </div>
            <h6>{curUser.name}</h6>
          </div>
          <p className="mt-4">
            Please enter your old password and new password
          </p>
          <p id="invalidWarning" className="text-danger my-1 mx-5">
            {errMsg}
          </p>
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
            <MDBBtn
              className="mb-4"
              style={{ fontSize: "14px" }}
              type="button"
              onClick={handleChangePwd}
            >
              Change password
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  ) : null;
}

export default ChangePassword;
