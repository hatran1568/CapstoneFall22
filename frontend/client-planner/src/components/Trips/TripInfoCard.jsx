import React, { useEffect } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import style from "./TripInfoCard.module.css";
import {
  MDBIcon,
  MDBCardImage,
  MDBCard,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";
import axios from "../../api/axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDongSign } from "@fortawesome/free-solid-svg-icons";

function TripInfoCard(trip) {
  const [isDeleted, setIsDeleted] = useState(false);
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

  const { confirm } = Modal;

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure to delete this plan?" + trip.trip.name,
      content: "The plan and all its contents will be deleted",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .delete("/trip/delete-trip/", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
            data: {
              id: trip.trip.tripId,
            },
          })
          .then(setIsDeleted(true));

        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return isDeleted ? null : (
    <MDBRow>
      <MDBCol sm="12">
        <MDBCard style={{ border: 0 }}>
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

                <p className="mt-2 mb-0">
                  <MDBIcon far icon="calendar-alt" />{" "}
                  {toLongDate(trip.trip.startDate)}
                  &nbsp;-&nbsp;{toLongDate(trip.trip.endDate)}
                </p>
                <p style={{ position: "relative", top: 0 }}>
                  <FontAwesomeIcon icon={faDongSign} />
                  &nbsp;{formatCurrency(trip.trip.budget).split(" ")[0]}
                </p>
              </a>
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
                onClick={showDeleteConfirm}
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
