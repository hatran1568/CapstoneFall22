import React, { useEffect } from "react";
import style from "./TripInfoCard.module.css";
import {
  MDBIcon,
  MDBCardImage,
  MDBCard,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";
import { green, grey } from "@mui/material/colors";

function TripInfoCard(trip) {
  useEffect(() => {
    document.title = "Profile | Tripplanner";
  }, []);

  return (
    <MDBRow>
      <MDBCol sm="12">
        <MDBCard>
          <MDBRow>
            <MDBCol sm="3">
              <MDBCardImage
                className={style.cropped}
                src="https://i.picsum.photos/id/1000/5626/3635.jpg?hmac=qWh065Fr_M8Oa3sNsdDL8ngWXv2Jb-EE49ZIn6c0P-g"
                fluid
              />
            </MDBCol>
            <MDBCol sm="8">
              <h5 className="mt-4">Trip to Hanoi</h5>
              <p className="mt-2">
                <MDBIcon far icon="calendar-alt" /> 22/10/2022 - 24/10/2022
              </p>
              <small className={style.lastUpdated}>
                <i>Last updated: 22/10/2022</i>
              </small>
            </MDBCol>
            <MDBCol sm="1">
              <MDBBtn
                tag="a"
                color="none"
                className={`${style.deleteButton} m-1 mt-4`}
              >
                <MDBIcon far icon="trash-alt" size="lg" />
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
}

export default TripInfoCard;
