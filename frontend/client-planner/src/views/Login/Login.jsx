import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import "./Login.css";

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(user);
    setUser({ ...user, email: "", password: "" });
  };

  return (
    <MDBContainer className="my-5 ">
      <MDBCard>
        <MDBRow className="g-0">
          <MDBCol md="6">
            <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4"></div>
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <h3 className="fw-normal  my-4 pb-3 text-center">Login</h3>
              <MDBInput
                wrapperClass="mb-4 mx-5"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
              <MDBInput
                wrapperClass="mb-2 mx-5"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <div className="d-flex justify-content-end">
                <a className="small text-muted mx-5" href="#!">
                  Forgot password?
                </a>
              </div>

              <MDBBtn
                className="mt-4 px-5 col-6 mx-auto mb-2"
                color="dark"
                size="lg"
                onClick={handleLogin}
              >
                Login
              </MDBBtn>

              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0">OR</p>
              </div>

              <MDBBtn
                className="btn btn-lg col-6 mx-auto btn-primary mb-2"
                style={{ backgroundColor: "#dd4b39" }}
                type="submit"
              >
                <i className="fab fa-google me-2"></i> Continue with google
              </MDBBtn>
              <MDBBtn
                className="btn btn-lg col-6 mx-auto btn-primary mb-5"
                style={{ backgroundColor: "#3b5998" }}
                type="submit"
              >
                <i className="fab fa-facebook me-2"></i> Continue with Facebook
              </MDBBtn>
              <p
                className="mb-0 pb-lg-2 text-center"
                style={{ color: "#393f81" }}
              >
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
