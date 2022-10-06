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
              <div className="d-flex flex-row justify-content-center mt-2">
                <MDBIcon
                  fas
                  icon="cubes fa-3x me-3"
                  style={{ color: "#ff6219" }}
                />
                <span className="h1 fw-bold mb-0">Tripplanner</span>
              </div>
              <h5 className="fw-normal display-6 my-4 pb-3 text-center">
                Register
              </h5>
              <MDBInput
                wrapperClass="mb-4 mx-5"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
              />
              <MDBInput
                wrapperClass="mb-2 mx-5"
                label="Password"
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

              <hr className="my-4" />

              <div className="text-center mb-5">
                <p>or sign up with:</p>

                <MDBBtn
                  tag="a"
                  color="none"
                  className="mx-3"
                  style={{ color: "#1266f1" }}
                >
                  <MDBIcon fab icon="facebook-f" size="sm" />
                </MDBBtn>

                <MDBBtn
                  tag="a"
                  color="none"
                  className="mx-3"
                  style={{ color: "#1266f1" }}
                >
                  <MDBIcon fab icon="twitter" size="sm" />
                </MDBBtn>

                <MDBBtn
                  tag="a"
                  color="none"
                  className="mx-3"
                  style={{ color: "#1266f1" }}
                >
                  <MDBIcon fab icon="google" size="sm" />
                </MDBBtn>
              </div>
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
