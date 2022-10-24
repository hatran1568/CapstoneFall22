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
import axios from "../../api/axios";
const LOGIN_URL = "/api/login";

function Login() {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [user, setUser] = useState({ username: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL, user, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const accessToken = response?.data?.accessToken;
      const role = response?.data?.role;
      const id = response?.data?.id;
      if (accessToken) {
        setAuth({ user, role, accessToken });
        localStorage.setItem("token", accessToken);
        localStorage.setItem("role", role);
        localStorage.setItem("id", id);
        window.location.href = "http://localhost:3000/";
      }
      setUser({ ...user, username: "", password: "" });
    } catch (error) {
      if (error.response.status === 403) {
        document.getElementById("invalidWarning").style.display = "block";
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      navigate("/");
    }
    document.title = "Login | Tripplanner";
  }, []);

  const handleLoginGoogle = (e) => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };
  const handleLoginFacebook = (e) => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/facebook";
  };
  return (
    <MDBContainer className="my-5 ">
      <MDBCard>
        <MDBRow className="g-0">
          <MDBCol md="6">
            <div
              className={`${style.customGradient} d-flex flex-column justify-content-center h-100 mb-4`}
            ></div>
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <h3 className="fw-normal my-4 pb-3 text-center">Login</h3>
              <MDBInput
                autocomplete="new-password"
                wrapperClass="mb-4 mx-5"
                label="Email address"
                id="loginEmail"
                type="email"
                size="lg"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
              <MDBInput
                wrapperClass="mb-2 mx-5"
                label="Password"
                id="loginPwd"
                type="password"
                size="lg"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <div className="d-flex justify-content-end">
                <a className="small text-muted mx-5" href="#!">
                  Forgot password?
                </a>
              </div>

              <p
                id="invalidWarning"
                className="text-danger my-1 mx-5"
                style={{ display: "none" }}
              >
                Wrong email or password!
              </p>

              <MDBBtn
                className="mt-4 px-5 col-6 mx-auto mb-2"
                color="dark"
                size="lg"
                onClick={handleLogin}
              >
                Login
              </MDBBtn>

              <div
                className={`${style.divider}  d-flex align-items-center my-4`}
              >
                <p className="text-center fw-bold mx-3 mb-0">OR</p>
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
                <i className="fab fa-google me-2"></i> Continue with google
              </MDBBtn>
              <MDBBtn
                className="btn btn-lg col-6 mx-auto btn-primary mb-5"
                style={{
                  backgroundColor: "#3b5998",
                  border: 0,
                  fontSize: "16px",
                }}
                type="submit"
                onClick={handleLoginFacebook}
              >
                <i className="fab fa-facebook me-2"></i> Continue with Facebook
              </MDBBtn>
              <p
                className="mb-0 pb-lg-2 text-center"
                style={{ color: "#393f81" }}
              >
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
