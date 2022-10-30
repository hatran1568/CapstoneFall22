import React, { Component, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import POISearchBar from "../../components/POISearchBar/POISearchBar";
import style from "./timeline.module.css";
function AddActivityModal(props) {
  const { activityAdded, allDates, onHide, ...rest } = props;
  const inputField = {
    date: allDates[0].toISOString().split("T")[0],
    activity_id: "",
    start_time: "08:00",
    end_time: "09:00",
    custom: false,
    name: "",
    address: "",
  };
  const setSelectedPOI = (item) => {
    inputField.activity_id = item.id;
  };
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const toggleCustom = () => {
    inputField.custom = !inputField.custom;
    setShowAddCustomModal(!showAddCustomModal);
  };
  const validateInput = (event) => {
    inputField.custom = showAddCustomModal;
    if (!inputField.custom && inputField.activity_id == "") {
      alert("Please choose a place or add a custom activity name");
      return;
    }
    if (inputField.custom && inputField.name == "") {
      alert("Please add a custom activity name or choose a place");
      return;
    }
    var sendFields = { ...inputField };
    resetInputField();
    activityAdded(event, sendFields);
  };
  const closeModal = () => {
    resetInputField();
    onHide();
  };
  const resetInputField = () => {
    inputField.date = allDates[0].toISOString().split("T")[0];
    inputField.activity_id = "";
    inputField.start_time = "08:00";
    inputField.end_time = "09:00";
    inputField.custom = false;
    inputField.name = "";
    inputField.address = "";
    setShowAddCustomModal(false);
  };
  return (
    <>
      <Modal
        {...rest}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <button
            className={`btn-close ${style.closeBtn}`}
            onClick={() => closeModal()}
          ></button>
          <form className={style.modalBody}>
            <div className="row">
              <div className="col-9">
                {showAddCustomModal ? (
                  <>
                    <label className={style.customLabel}>
                      Name:
                      <input
                        className={`form-control`}
                        name="name"
                        required
                        onChange={(e) => {
                          inputField.name = e.target.value;
                        }}
                      />
                    </label>
                    <label className={style.customLabel}>
                      Address:
                      <input
                        className={`form-control`}
                        name="address"
                        onChange={(e) => {
                          inputField.address = e.target.value;
                        }}
                      />
                    </label>
                  </>
                ) : (
                  <POISearchBar POISelected={setSelectedPOI} />
                )}
              </div>
              <div className="col-3">
                <button
                  type="button"
                  className={`btn ${style.customBtn}`}
                  onClick={toggleCustom}
                >
                  {showAddCustomModal
                    ? "Select a Place"
                    : "Add Custom Activity"}
                </button>
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
            variant="outline-dark"
            onClick={(event) => {
              validateInput(event);
            }}
            className={style.submitBtn}
          >
            Add This Activity
          </Button>
          <Button
            onClick={() => {
              closeModal();
            }}
            variant="outline-secondary"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddActivityModal;
