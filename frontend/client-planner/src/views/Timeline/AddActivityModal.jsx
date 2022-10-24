import React, { Component, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import POISearchBar from "../../components/POISearchBar/POISearchBar";
import style from "./timeline.module.css";
function AddActivityModal(props) {
  const { activityAdded, allDates, ...rest } = props;
  const inputField = {
    date: props.allDates[0].toISOString().split("T")[0],
    activity_id: "",
    start_time: "",
    end_time: "",
  };
  const setSelectedPOI = (item) => {
    inputField.activity_id = item.id;
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
          Add an activity to your trip
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="row">
            <div className="col-9">
              <POISearchBar POISelected={setSelectedPOI} />
            </div>
            <div className="col-3">
              <button className={style.customBtn}>ADD CUSTOM ACTIVITY</button>
            </div>
          </div>
          <br />
          <div className={`row ${style.formField}`}>
            <label className="col-4">
              Date:
              <select
                className={`form-select`}
                name="date"
                onChange={(e) => {
                  inputField.date = e.target.value;
                }}
              >
                {allDates.map((date) => (
                  <option
                    className="form-control"
                    value={date.toISOString().split("T")[0]}
                    key={date.toISOString().split("T")[0]}
                  >
                    {date.toISOString().split("T")[0]}
                  </option>
                ))}
              </select>
            </label>
            <label className="col-4">
              Start time:
              <input
                name="start_time"
                className="form-control"
                type="time"
                defaultValue={"08:00"}
                onChange={(e) => {
                  inputField.start_time = e.target.value;
                }}
              />
            </label>
            <br />
            <label className="col-4">
              End time:
              <input
                className="form-control"
                name="end_time"
                defaultValue={"09:00"}
                type="time"
                onChange={(e) => {
                  inputField.end_time = e.target.value;
                }}
              />
            </label>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={(event) => {
            if (inputField.activity_id == "") {
              alert("Please choose a place or add a custom activity name");
              return;
            }
            activityAdded(event, inputField);
          }}
        >
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
