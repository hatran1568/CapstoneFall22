import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
} from "mdb-react-ui-kit";
import axios from "../../api/axios";
import validator from 'validator'
import { useState } from "react";
import style from "./Login.module.css";

const REGISTER_URL = "/user/api/register";
const LOGIN_URL = "/auth/api/login";

function Signup() {
  const pattern = /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/;
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleValidation = () => {
    let formIsValid = true;
    if (user.username === "" || user.username.length < 3) {
      formIsValid = false;
      document.getElementById("errUsername").style.display = "block";
    } else {
      document.getElementById("errUsername").style.display = "none";
    }
    if (user.email === "" || !user.email.match(pattern)) {
      formIsValid = false;
      document.getElementById("errEmail").style.display = "block";
    } else {
      document.getElementById("errEmail").style.display = "none";
    }
    if (user.password === "" || user.password.length < 8) {
      formIsValid = false;
      document.getElementById("errPwd").style.display = "block";
    } else {
      document.getElementById("errPwd").style.display = "none";
    }
    if (!(user.confirmPassword === user.password)) {
      formIsValid = false;
      document.getElementById("errCfPwd").style.display = "block";
    } else {
      document.getElementById("errCfPwd").style.display = "none";
    }

    return formIsValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      try {
        await axios.post(
          REGISTER_URL,
          {
            username: user.username,
            email: user.email,
            password: user.password,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        ).then((res) => {
          if (res.status == 200) {
            const response = axios.post(
              LOGIN_URL,
              {
                username: user.email,
                password: user.password,
              },
              {
                headers: { "Content-Type": "application/json" },
              }
            ).then((resLogin) => {
              const accessToken = resLogin?.data?.accessToken;
              const role = resLogin?.data?.role;
              const id = resLogin?.data?.id;
              if (accessToken) {
                localStorage.setItem("token", accessToken);
                localStorage.setItem("role", role);
                localStorage.setItem("id", id);
              }
              window.location.href = "http://localhost:3000/";
            });
          }
        });
      } catch (error) {
        if (error.response.status === 400) {
          document.getElementById("invalidWarning").style.display = "block";
        }
      }
    }
  };

  useEffect(() => {
    document.title = "????ng k?? | Tripplanner";
  }, []);

  return (
    <MDBContainer className="my-5 ">
      <MDBCard>
        <MDBRow className="g-0">
          <MDBCol md="6">
            <div className={`d-flex flex-column justify-content-center h-100`}>
              <img src="../img/default/loginimage.png"
                className={`${style.customGradient}`}
              ></img>
            </div>
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <div className={style.pageTitle}>????ng k??</div>
              <div className={style.registerInputDiv}>
                <MDBInput
                  wrapperClass="mt-4 mx-5"
                  label="T??n hi???n th???"
                  id="formUsername"
                  type="text"
                  size="lg"
                  maxLength={200}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                />
                <span
                  style={{ color: "red", display: "none" }}
                  className="mx-5"
                  id="errUsername"
                >
                  T??n hi???n th??? ph???i d??i 3-200 k?? t???
                </span>
              </div>
              <div className={style.registerInputDiv}>
                <MDBInput
                  wrapperClass="mt-4 mx-5"
                  label="?????a ch??? email"
                  id="formEmail"
                  type="email"
                  maxLength={500}
                  size="lg"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <span
                  style={{ color: "red", display: "none" }}
                  className="mx-5"
                  id="errEmail"
                >
                  H??y ki???m tra l???i email c???a b???n
                </span>
              </div>
              <div className={style.registerInputDiv}>
                <MDBInput
                  wrapperClass="mt-4 mx-5"
                  label="M???t kh???u"
                  id="formPwd"
                  type="password"
                  size="lg"
                  maxLength={64}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
                <span
                  style={{ color: "red", display: "none" }}
                  className="mx-5"
                  id="errPwd"
                >
                  M???t kh???u ph???i d??i 8-64 k?? t???
                </span>
              </div>
              <div className={style.registerInputDiv}>
                <MDBInput
                  wrapperClass="mt-4 mx-5"
                  label="X??c nh???n m???t kh???u"
                  id="formPwdCf"
                  type="password"
                  maxLength={64}
                  size="lg"
                  onChange={(e) =>
                    setUser({ ...user, confirmPassword: e.target.value })
                  }
                />
                <span
                  style={{ color: "red", display: "none" }}
                  className="mx-5"
                  id="errCfPwd"
                >
                  M???t kh???u x??c nh???n kh??ng tr??ng v???i m???t kh???u
                </span>
                <span
                  style={{ color: "red", display: "none" }}
                  className="mx-5"
                  id="invalidWarning"
                >
                  Email n??y ???? ???????c s??? d???ng
                </span>
              </div>
              <MDBBtn
                className={style.registerButton}
                color="dark"
                size="lg"
                type="button"
                onClick={handleRegister}
              >
                ????ng k??
              </MDBBtn>
              <p
                className="mt-5 mb-0 pb-lg-2 text-center"
                style={{ color: "#393f81" }}
              >
                B???n ???? c?? t??i kho???n? <Link to="/login">????ng nh???p t???i ????y</Link>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Signup;
