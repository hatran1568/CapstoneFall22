import React, { Component, useState } from "react";
import props from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
function AddActivityModal(props) {
  const { activityAdded, allDates, ...rest } = props;
  const inputField = {
    date: props.allDates[0].toISOString().split("T")[0],
    activity_id: "",
    start_time: "",
    end_time: "",
  };
  // const handleChange = (event) => {
  //   console.log("changing");
  //   setInputField({
  //     ...inputField,
  //     [event.target.name]: event.target.value,
  //   });
  //   console.log(inputField);
  // };
  return (
    <Modal
      {...rest}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add an activity to your trip
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <label>
            Date:
            <select
              name="date"
              onChange={(e) => {
                inputField.date = e.target.value;
              }}
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
            Activity ID:
            <input
              name="activity_id"
              onChange={(e) => {
                inputField.activity_id = e.target.value;
              }}
            ></input>
          </label>
          <br />
          <label>
            Start time:
            <input
              name="start_time"
              type="time"
              onChange={(e) => {
                inputField.start_time = e.target.value;
              }}
            />
          </label>
          <br />
          <label>
            End time:
            <input
              name="end_time"
              type="time"
              onChange={(e) => {
                inputField.end_time = e.target.value;
              }}
            />
          </label>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(event) => activityAdded(event, inputField)}>
          Save
        </Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddActivityModal;
