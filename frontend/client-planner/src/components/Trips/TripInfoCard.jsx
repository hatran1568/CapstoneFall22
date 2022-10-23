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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDongSign } from "@fortawesome/free-solid-svg-icons";

function TripInfoCard(trip) {
  const toLongDate = (date) => {
    var options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    var today = new Date(date);
    return today.toLocaleDateString("en-IE");
  };

  const formatCurrency = (string) => {
    return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <MDBRow>
      <MDBCol sm="12">
        <MDBCard>
          <MDBRow>
            <MDBCol sm="3">
              <MDBCardImage
                className={style.cropped}
                src={
                  trip.trip.image
                    ? trip.trip.image
                    : "https://i.picsum.photos/id/1000/5626/3635.jpg?hmac=qWh065Fr_M8Oa3sNsdDL8ngWXv2Jb-EE49ZIn6c0P-g"
                }
                fluid
              />
            </MDBCol>
            <MDBCol sm="8">
              <a
                className={style.link}
                href={"http://localhost:3000/trip/" + trip.trip.tripId}
              >
                <h5 className="mt-4">{trip.trip.name}</h5>
              </a>
              <p className="mt-2">
                <MDBIcon far icon="calendar-alt" />{" "}
                {toLongDate(trip.trip.startDate)}
                &nbsp;-&nbsp;{toLongDate(trip.trip.endDate)}
              </p>
              <p>
                <FontAwesomeIcon icon={faDongSign} />
                &nbsp;{formatCurrency(trip.trip.budget).split(" ")[0]}
              </p>
              <small className={style.lastUpdated}>
                <i>
                  Last updated:{" "}
                  {toLongDate(trip.trip.dateModified.split("T")[0])}
                </i>
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
