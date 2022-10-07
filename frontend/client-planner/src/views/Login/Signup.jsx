import React from "react";
import { Link } from "react-router-dom";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";

function Signup() {
  return (
    <MDBContainer className="my-5 ">
      <MDBCard>
        <MDBRow className="g-0">
          <MDBCol md="6">
            <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4"></div>
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <h3 className="fw-normal my-3 pb-3 text-center">Register</h3>
              <MDBInput
                wrapperClass="mb-4 mx-5"
                label="Username"
                id="formControlLg"
                type="text"
                size="lg"
              />
              <MDBInput
                wrapperClass="mb-4 mx-5"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
              />
              <MDBInput
                wrapperClass="mb-4 mx-5"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
              />
              <MDBInput
                wrapperClass="mb-2 mx-5"
                label="Confirm password"
                id="formControlLg"
                type="password"
                size="lg"
              />

              <MDBBtn
                className="mt-4 px-5 col-6 mx-auto mb-2"
                color="dark"
                size="lg"
              >
                Register
              </MDBBtn>

              <div className="divider d-flex align-items-center my-2">
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
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Signup;
