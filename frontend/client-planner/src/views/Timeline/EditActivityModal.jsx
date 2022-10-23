import React, { Component, useState, useEffect } from "react";
import props from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
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
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit your activity
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <label>
            Activity at:
            <input disabled value={inputField.masterActivity.name} />
          </label>
          <br />
          <div className="row">
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
