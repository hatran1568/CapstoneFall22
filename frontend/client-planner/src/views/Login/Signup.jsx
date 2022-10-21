import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from "mdb-react-ui-kit";
import axios from "../../api/axios";
import { useState } from "react";

const REGISTER_URL = "/api/register";
const LOGIN_URL = "/api/login";

function Signup() {
  const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleValidation = () => {
    let formIsValid = true;
    if (user.username === "") {
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
    if (user.password === "") {
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
            withCredentials: true,
          },
        );
        const response = await axios.post(
          LOGIN_URL,
          {
            username: user.email,
            password: user.password,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          },
        );
        const accessToken = response?.data?.accessToken;
        const role = response?.data?.role;
        const id = response?.data?.id;

        if (accessToken) {
          localStorage.setItem("token", accessToken);
          localStorage.setItem("role", role);
          localStorage.setItem("id", id);
        }
        window.location.href = "http://localhost:3000/";
      } catch (error) {
        if (error.response.status === 400) {
          document.getElementById("invalidWarning").style.display = "block";
        }
      }
    }
  };

  return (
    <MDBContainer className='my-5 '>
      <MDBCard>
        <MDBRow className='g-0'>
          <MDBCol md='6'>
            <div className='d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4'></div>
          </MDBCol>

          <MDBCol md='6'>
            <MDBCardBody className='d-flex flex-column'>
              <h3 className='fw-normal my-3 pb-3 text-center'>Register</h3>
              <MDBInput
                wrapperClass='mt-4 mx-5'
                label='Username'
                id='formUsername'
                type='text'
                size='lg'
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
              <span style={{ color: "red", display: "none" }} className='mx-5' id='errUsername'>
                Username must not be empty
              </span>

              <MDBInput
                wrapperClass='mt-4 mx-5'
                label='Email address'
                id='formEmail'
                type='email'
                size='lg'
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <span style={{ color: "red", display: "none" }} className='mx-5' id='errEmail'>
                Please check your email
              </span>

              <MDBInput
                wrapperClass='mt-4 mx-5'
                label='Password'
                id='formPwd'
                type='password'
                size='lg'
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <span style={{ color: "red", display: "none" }} className='mx-5' id='errPwd'>
                Password cannot be empty
              </span>

              <MDBInput
                wrapperClass='mt-4 mx-5'
                label='Confirm password'
                id='formPwdCf'
                type='password'
                size='lg'
                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              />
              <span style={{ color: "red", display: "none" }} className='mx-5' id='errCfPwd'>
                Confirm password doesn't match password
              </span>
              <span style={{ color: "red", display: "none" }} className='mx-5' id='invalidWarning'>
                Email already in use!
              </span>
              <MDBBtn
                className='my-4 px-5 col-6 mx-auto mb-2'
                color='dark'
                size='lg'
                type='button'
                onClick={handleRegister}
              >
                Register
              </MDBBtn>

              <p className='mt-5 mb-0 pb-lg-2 text-center' style={{ color: "#393f81" }}>
                Already have an account? <Link to='/login'>Login</Link>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Signup;
