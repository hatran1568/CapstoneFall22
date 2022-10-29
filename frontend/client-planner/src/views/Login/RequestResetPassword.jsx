import { MDBBtn, MDBContainer, MDBInput, MDBIcon } from "mdb-react-ui-kit";
import { React, useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import style from "./Login.module.css";
import axios from "../../api/axios";
import CircularProgress from "@mui/material/CircularProgress";

function RequestResetPassword() {
  const [isFetching, setIsFetching] = useState(false);

  const [current, setCurrent] = useState(0);
  const [email, setEmail] = useState();
  const [errMsg, setErrMsg] = useState("");

  const handleRequestEmail = () => {
    setIsFetching(true);

    axios
      .post("/api/user/password-reset-request", email, {
        headers: {
          "Content-Type": "text/plain",
        },
      })
      .catch((error) => {
        setErrMsg("Please check your email");
      })
      .then(() => {
        setCurrent(1);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    document.title = "Reset password | Tripplanner";
  }, [current, isFetching, errMsg]);

  return (
    <MDBContainer
      className={`${style.customContainer} mt-4 item-align-center text-center`}
    >
      <Stepper activeStep={current} alternativeLabel>
        <Step key="Step 1">
          <StepLabel>Step 1</StepLabel>
        </Step>
        <Step key="Step 2">
          <StepLabel>Step 2</StepLabel>
        </Step>
        <Step key="Step 3">
          <StepLabel>Step 3</StepLabel>
        </Step>
        <Step key="Step 4">
          <StepLabel>Step 4</StepLabel>
        </Step>
      </Stepper>

      {current == 0 ? (
        <div>
          <MDBIcon
            style={{ margin: "100px auto 0px auto" }}
            fas
            icon="key"
            size="3x"
          />{" "}
          <h4>Forgot password?</h4>
          <p style={{ margin: "0px 10% " }}>
            {" "}
            Enter the email address that you are using for your account below
            and we will send you an email with the link to reset your password
          </p>
          <div style={{ margin: "0px 20% " }}>
            <p
              style={{ textAlign: "left", fontWeight: "bold" }}
              className="text-left mt-2 mx-5"
            >
              Email address
            </p>
            <MDBInput
              wrapperClass="mb-0 mx-5"
              id="loginEmail"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            ></MDBInput>
          </div>
          <p id="invalidWarning" className="text-danger my-0 mx-5">
            {errMsg}
          </p>
          {isFetching ? (
            <MDBBtn className="mt-4 px-5 mx-auto" color="dark">
              <CircularProgress />
            </MDBBtn>
          ) : (
            <MDBBtn
              className="mt-4 px-5 mx-auto"
              color="dark"
              onClick={handleRequestEmail}
            >
              Reset password
            </MDBBtn>
          )}
        </div>
      ) : (
        <div>
          <MDBIcon
            style={{ margin: "100px auto 0px auto" }}
            fas
            icon="envelope"
            size="3x"
          />
          <h4>Check your mail</h4>

          <p style={{ margin: "0px 10% " }}>
            {" "}
            We sent a password reset link to {email}
          </p>
        </div>
      )}
    </MDBContainer>
  );
}

export default RequestResetPassword;
