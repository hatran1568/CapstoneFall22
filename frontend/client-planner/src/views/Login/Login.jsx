import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import style from "./Login.module.css";
import useAuth from "../../hooks/useAuth";
import validator from "validator";
import axios from "../../api/axios";
const LOGIN_URL = "/auth/api/login";

function Login() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [user, setUser] = useState({ username: "", password: "" });
  const setTripsPostLogin = (userId) => {
    console.log("setting trips");
    let trips = localStorage.getItem("trips");
    if (trips) {
      trips = JSON.parse(trips);
      axios({
        method: "post",
        url: "http://localhost:8080/trip/set-trips-postlogin",
        data: { tripIds: trips, user: userId },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .catch((error) => console.log(error))
        .then((response) => {
          console.log("response setting trips: ", response.status);

          localStorage.removeItem("trips");
        });
    }
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (!validator.isEmail(user.username) || user.password.length < 8)
      document.getElementById("invalidWarning").style.display = "block";
    else
      axios
        .post(LOGIN_URL, user, {
          headers: { "Content-Type": "application/json" },
        })
        .catch((error) => {
          if (error.response.status == 404) {
            document.getElementById("invalidWarning").style.display = "block";
          }
        })
        .then((response) => {
          const accessToken = response?.data?.accessToken;
          const role = response?.data?.role;
          const id = response?.data?.id;
          if (accessToken) {
            setAuth({ user, role, accessToken });
            localStorage.setItem("token", accessToken);
            localStorage.setItem("role", role);
            localStorage.setItem("id", id);
            console.log("about to set trip");
            setTripsPostLogin(id);
            if (role != "Admin") {
              window.location.href = "http://localhost:3000/";
            } else {
              window.location.href = "http://localhost:3000/admin/dashboard";
            }
          }
          setUser({ ...user, username: "", password: "" });
        });
  };

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      navigate("/");
    }
    document.title = "Login | Tripplanner";
  }, []);

  const handleLoginGoogle = (e) => {
    window.location.href = "http://localhost:8088/oauth2/authorization/google";
  };
  const handleLoginFacebook = (e) => {
    window.location.href =
      "http://localhost:8088/oauth2/authorization/facebook";
  };
  return (
    <MDBContainer className="my-5 ">
      <MDBCard>
        <MDBRow className="g-0">
          <MDBCol md="6">
            <div className={`d-flex flex-column justify-content-center h-100`}>
              <img
                src="../img/default/loginimage.png"
                className={`${style.customGradient}`}
              ></img>
            </div>
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <h3 className="fw-normal my-4 pb-3 text-center">Đăng Nhập</h3>
              <div className={style.inputDiv}>
                <MDBInput
                  autoComplete="new-password"
                  wrapperClass="mb-4 mx-5"
                  label="Địa chỉ email"
                  id="loginEmail"
                  type="email"
                  size="lg"
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                />
              </div>
              <div className={style.inputDiv}>
                <MDBInput
                  wrapperClass="mb-2 mx-5"
                  label="Mật khẩu"
                  id="loginPwd"
                  type="password"
                  size="lg"
                  maxLength={64}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>
              <div className="d-flex justify-content-end">
                <a className="small text-muted mx-5" href="/forgot-password">
                  Quên mật khẩu?
                </a>
              </div>

              <p
                id="invalidWarning"
                className="text-danger my-1 mx-5"
                style={{ display: "none" }}
              >
                Sai email hoặc mật khẩu!
              </p>

              <MDBBtn
                className="mt-4 px-5 col-6 mx-auto mb-2"
                color="dark"
                size="lg"
                onClick={handleLogin}
              >
                Đăng nhập
              </MDBBtn>

              <div
                className={`${style.divider}  d-flex align-items-center my-4`}
              >
                <p className="text-center fw-bold mx-3 mb-0">HOẶC</p>
              </div>

              <MDBBtn
                className="btn btn-lg col-6 mx-auto btn-primary mb-2"
                style={{
                  backgroundColor: "#dd4b39",
                  border: 0,
                  fontSize: "16px",
                }}
                type="submit"
                onClick={handleLoginGoogle}
              >
                <i className="fab fa-google me-2"></i> Tiếp tục với Google
              </MDBBtn>
              <p
                className="mb-0 pb-lg-2 text-center"
                style={{ color: "#393f81" }}
              >
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
