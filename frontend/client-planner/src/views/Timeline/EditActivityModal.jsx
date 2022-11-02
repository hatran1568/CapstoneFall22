import React, { Component, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "../Timetable/modals.module.css";
import Rating from "../../components/POIs/Rating";
function EditActivityModal(props) {
  const { activityEdited, allDates, tripDetail, onHide, ...rest } = props;
  const [inputField, setInputField] = useState(
    JSON.parse(JSON.stringify(tripDetail))
  );
  const [showWarningTime, setShowWarningTime] = useState(false);
  const [showWarningName, setShowWarningName] = useState(false);

  const validateInput = (event) => {
    if (inputField.masterActivity.custom) {
      if (inputField.masterActivity.name == "") {
        setShowWarningName(true);
        return;
      }
    }
    var startStr = inputField.startTime.split(":");
    var start = +startStr[0] * 60 * 60 + +startStr[1] * 60;
    var endStr = inputField.endTime.split(":");
    var end = +endStr[0] * 60 * 60 + +endStr[1] * 60;
    if (end <= start) {
      setShowWarningTime(true);
      return;
    }
    activityEdited(event, inputField);
  };
  const closeModal = () => {
    setInputField({});
    onHide();
  };
  return (
    <div>
      {tripDetail !== {} && (
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
            {!tripDetail.masterActivity.custom ? (
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
                          <Rating
                            ratings={tripDetail.masterActivity.googleRate}
                          />
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
            ) : null}
            <form className={style.editForm}>
              {tripDetail.masterActivity.custom ? (
                <>
                  <label className={style.customLabel}>
                    Name:
                    <input
                      className={`form-control`}
                      name="name"
                      required
                      defaultValue={tripDetail.masterActivity.name}
                      onChange={(e) => {
                        inputField.masterActivity.name = e.target.value;
                      }}
                    />
                  </label>
                  <label className={style.customLabel}>
                    Address:
                    <input
                      className={`form-control`}
                      name="address"
                      defaultValue={tripDetail.masterActivity.address}
                      onChange={(e) => {
                        inputField.masterActivity.address = e.target.value;
                      }}
                    />
                  </label>
                  <div
                    className={
                      showWarningName
                        ? `${style.warningMessageName}`
                        : `${style.warningMessageName} ${style.hide}`
                    }
                  >
                    Hãy chọn một địa điểm hoặc thêm một hoạt động của bạn.
                  </div>
                </>
              ) : (
                <></>
              )}

              <div className={`container row ${style.timeGroupDiv}`}>
                <label className="col-4">
                  Date:
                  <select
                    className="form-select"
                    name="date"
                    onChange={(e) => {
                      inputField.date = e.target.value;
                    }}
                    defaultValue={tripDetail.date}
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
                    defaultValue={inputField.startTime}
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
                    defaultValue={inputField.endTime}
                    onChange={(e) => {
                      inputField.endTime = e.target.value;
                    }}
                  />
                  <div
                    className={
                      showWarningTime
                        ? `${style.warningMessage}`
                        : `${style.warningMessage} ${style.hide}`
                    }
                  >
                    Thời gian kết thúc phải lớn hơn thời gian bắt đầu
                  </div>
                </label>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={(event) => validateInput(event)}
              className={style.submitBtn}
            >
              Save
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
      )}
    </div>
  );
}

export default EditActivityModal;
