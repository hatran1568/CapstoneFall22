import React, { Component, useState, useEffect } from "react";
import props from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "./timeline.module.css";
import Rating from "../../components/Rating";
function AddActivityModal(props) {
  const { activityEdited, allDates, tripDetail, ...rest } = props;
  const inputField = { ...tripDetail };
  useEffect(() => {
    inputField.startTime = getTimeFromSecs(tripDetail.startTime);
    inputField.endTime = getTimeFromSecs(tripDetail.endTime);
  });
  const getTimeFromSecs = (seconds) => {
    var date = new Date(0);
    date.setSeconds(seconds); // specify value for SECONDS here
    var timeString = date.toISOString().substring(11, 16);
    return timeString;
  };
  return (
    <Modal
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <button
          className={`btn-close ${style.closeBtn}`}
          onClick={props.onHide}
        ></button>
        <div className={style.activityInfo}>
          <div className={style.poiDiv}>
            <img
              src={
                tripDetail.masterActivity.images
                  ? tripDetail.masterActivity.images[0]
                    ? `../${tripDetail.masterActivity.images[0].url}`
                    : "https://picsum.photos/seed/picsum/300/200"
                  : "https://picsum.photos/seed/picsum/300/200"
              }
              alt=""
              className={style.poiImage}
            />
          </div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "20px" }}>
              {tripDetail.masterActivity.name
                ? tripDetail.masterActivity.name
                : ""}
            </div>
            <div className={style.ratingDiv}>
              {tripDetail.masterActivity.googleRate ? (
                <div>
                  <span>
                    <Rating ratings={tripDetail.masterActivity.googleRate} />
                  </span>
                  <span className={style.ratingNum}>
                    {tripDetail.masterActivity.googleRate}
                  </span>
                </div>
              ) : (
                ""
              )}{" "}
            </div>
          </div>
          <p className={style.poiDescription}>
            {tripDetail.masterActivity.description
              ? tripDetail.masterActivity.description
              : ""}
          </p>
          <div className={style.linkDiv}>
            <a
              href={"../poi?id=" + tripDetail.masterActivity.activityId}
              className={style.detailLink}
            >
              See full attraction detail
            </a>
          </div>
        </div>
        <form className={style.editForm}>
          <div className={`container row ${style.timeGroupDiv}`}>
            <label className="col-4">
              Date:
              <select
                className="form-select"
                name="date"
                onChange={(e) => {
                  inputField.date = e.target.value;
                }}
                defaultValue={inputField.date}
              >
                {allDates.map((date) => (
                  <option
                    value={date.toISOString().split("T")[0]}
                    key={date.toISOString().split("T")[0]}
                  >
                    {date.toISOString().split("T")[0]}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label className="col-4">
              Start time:
              <input
                className="form-control"
                name="start_time"
                type="time"
                defaultValue={getTimeFromSecs(tripDetail.startTime)}
                onChange={(e) => {
                  inputField.startTime = e.target.value;
                }}
              />
            </label>
            <br />
            <label className="col-4">
              End time:
              <input
                className="form-control"
                name="end_time"
                type="time"
                defaultValue={getTimeFromSecs(inputField.endTime)}
                onChange={(e) => {
                  inputField.endTime = e.target.value;
                }}
              />
            </label>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(event) => props.activityEdited(event, inputField)}>
          Save
        </Button>
        <Button onClick={props.onHide} variant="secondary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddActivityModal;
