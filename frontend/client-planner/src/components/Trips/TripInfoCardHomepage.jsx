import { MDBCard, MDBCardImage, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import { React, useState } from "react";
import style from "./TripInfoCardHomepage.module.css";
import axios from "../../api/axios";
import { Modal } from "antd";
import "antd/dist/antd.css";

function TripInfoCardHomepage(trip) {
  const [isDeleted, setIsDeleted] = useState(false);

  const toLongDate = (date) => {
    var today = new Date(date);
    return today.toLocaleDateString("en-IE");
  };
  const formatCurrency = (string) => {
    return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const { confirm } = Modal;

  const showDeleteConfirm = (e) => {
    e.stopPropagation(); // notice this

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
      },
      onCancel() {},
    });
  };

  return isDeleted ? null : (
    <MDBCard
      className={style.card}
      onClick={() => {
        window.location.href = "http://localhost:3000/trip/" + trip.trip.tripId;
      }}
    >
      <MDBCardImage
        className={style.img}
        src={
          trip.trip.image
            ? trip.trip.image
            : "https://i.picsum.photos/id/1015/6000/4000.jpg?hmac=aHjb0fRa1t14DTIEBcoC12c5rAXOSwnVlaA5ujxPQ0I"
        }
        alt="..."
      />
      <div className={style.caption}>
        <p>{trip.trip.name}</p>
        <p style={{ fontSize: "1vw" }}>
          {toLongDate(trip.trip.startDate)}
          &nbsp;-&nbsp;{toLongDate(trip.trip.endDate)}
        </p>
      </div>
      <div className={style.description}>
        <div>
          <b>Budget:</b>&nbsp;{formatCurrency(trip.trip.budget)}
        </div>
        <div>
          <b>Last updated:</b>&nbsp;
          {toLongDate(trip.trip.dateModified.split("T")[0])}
        </div>
      </div>
      <MDBBtn
        tag="a"
        color="none"
        style={{ zIndex: "1000" }}
        onClick={showDeleteConfirm}
        className={`${style.deleteButton} m-1 mt-4`}
      >
        <MDBIcon far icon="trash-alt" size="lg" />
      </MDBBtn>
    </MDBCard>
  );
}

export default TripInfoCardHomepage;
