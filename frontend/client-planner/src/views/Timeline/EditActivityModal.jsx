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
      size="md"
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
          <label>
            Date:
            <select
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
          <label>
            Start time:
            <input
              name="start_time"
              type="time"
              defaultValue={getTimeFromSecs(tripDetail.startTime)}
              onChange={(e) => {
                inputField.startTime = e.target.value;
              }}
            />
          </label>
          <br />
          <label>
            End time:
            <input
              name="end_time"
              type="time"
              defaultValue={getTimeFromSecs(inputField.endTime)}
              onChange={(e) => {
                inputField.endTime = e.target.value;
              }}
            />
          </label>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(event) => props.activityEdited(event, inputField)}>
          Save
        </Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddActivityModal;
