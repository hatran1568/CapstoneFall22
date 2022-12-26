import React, { useEffect } from "react";
import { Modal } from "antd";
import "antd/dist/antd.css";
import style from "./TripInfoCard.module.css";
import { MDBIcon, MDBCardImage, MDBCard, MDBRow, MDBCol, MDBBtn } from "mdb-react-ui-kit";
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
    return today.toLocaleDateString("vi", options);
  };

  const formatCurrency = (string) => {
    return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const { confirm } = Modal;

  const showDeleteConfirm = (e) => {
    e.stopPropagation();
    e.preventDefault();
    confirm({
      title: "Bạn có chắc chắn muốn xóa chuyến đi này?\n" + trip.trip.name,
      content: "Chuyến đi và tất cả nội dung sẽ bị xóa hoàn toàn.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        axios
          .delete("/trip/delete-trip/", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },

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
    <MDBRow className={style.card}>
      <MDBCol sm='12'>
        <MDBCard style={{ border: 0 }}>
          <a className={style.link} href={"http://localhost:3000/timeline/" + trip.trip.tripId}>
            <MDBRow>
              <MDBCol sm='3'>
                <MDBCardImage
                  className={style.cropped}
                  src={
                    trip.trip.image
                      ? trip.trip.image
                      : "https://i.picsum.photos/id/1015/6000/4000.jpg?hmac=aHjb0fRa1t14DTIEBcoC12c5rAXOSwnVlaA5ujxPQ0I"
                  }
                  fluid
                />
              </MDBCol>
              <MDBCol sm='8'>
                <h5 className='mt-4'>{trip.trip.name}</h5>
                <p className='mt-2 mb-0'>
                  <MDBIcon far icon='calendar-alt' /> {toLongDate(trip.trip.startDate)}
                  &nbsp;-&nbsp;{toLongDate(trip.trip.endDate)}
                </p>
                <p style={{ position: "relative", top: 0 }}>
                  <FontAwesomeIcon icon={faDongSign} />
                  &nbsp;{formatCurrency(trip.trip.budget).split(" ")[0]}
                </p>

                <small className={style.lastUpdated}>
                  <i>Chỉnh sửa: {toLongDate(trip.trip.dateModified.split("T")[0])}</i>
                </small>
              </MDBCol>
              <MDBCol sm='1'>
                <div className='mt-4'>
                  <button className={`${style.deleteButton}`} onClick={(e) => showDeleteConfirm(e)}>
                    <MDBIcon far icon='trash-alt' size='lg' />
                  </button>
                </div>
              </MDBCol>
            </MDBRow>
          </a>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
}

export default TripInfoCard;
