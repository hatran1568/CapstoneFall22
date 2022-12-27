import React, { Component, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import POISearchBar from "../../components/POISearchBar/POISearchBar";
import style from "../Timetable/modals.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "date-fns/locale/vi";
function AddActivityModal(props) {
  const { activityAdded, allDates, onHide, ...rest } = props;
  const [inputField, setInputField] = useState({
    date: allDates[0].toISOString().split("T")[0],
    activity_id: "",
    start_time: "08:00",
    end_time: "09:00",
    custom: false,
    name: "",
    address: "",
    note: "",
  });
  const handleChange = (event) => {
    setInputField({ ...inputField, [event.target.name]: event.target.value });
  };
  const setSelectedPOI = (item) => {
    setInputField({ ...inputField, activity_id: item.id });
  };
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [showWarningTime, setShowWarningTime] = useState(false);
  const [showWarningName, setShowWarningName] = useState(false);
  const [date, setDate] = useState(allDates[0]);
  const toggleCustom = () => {
    inputField.custom = !inputField.custom;
    setShowAddCustomModal(!showAddCustomModal);
  };
  const validate = () => {
    inputField.custom = showAddCustomModal;
    if (!inputField.custom && inputField.activity_id == "") {
      setShowWarningName(true);
      return false;
    }
    if (inputField.custom && inputField.name == "") {
      setShowWarningName(true);
      return false;
    }
    var startStr = inputField.start_time.split(":");
    var start = +startStr[0] * 60 * 60 + +startStr[1] * 60;
    var endStr = inputField.end_time.split(":");
    var end = +endStr[0] * 60 * 60 + +endStr[1] * 60;
    if (end <= start) {
      setShowWarningTime(true);
      return false;
    }
    return true;
  };
  const validateInput = (event) => {
    event.preventDefault();
    var validated = validate();
    if (validated) {
      var sendFields = { ...inputField };
      resetInputField();
      console.log(sendFields);
      activityAdded(event, sendFields);
    }
  };
  const closeModal = () => {
    resetInputField();
    onHide();
  };
  const resetInputField = () => {
    setInputField({
      date: allDates[0].toISOString().split("T")[0],
      activity_id: "",
      start_time: "08:00",
      end_time: "09:00",
      custom: false,
      name: "",
      address: "",
      note: "",
    });
    setShowWarningName(false);
    setShowWarningTime(false);
    setShowAddCustomModal(false);
    setDate(allDates[0]);
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
                      Tên hoạt động:
                      <input
                        className={`form-control`}
                        name="name"
                        required
                        onChange={(e) => {
                          inputField.name = e.target.value;
                        }}
                        spellCheck="false"
                        maxLength={200}
                      />
                    </label>
                    <label className={style.customLabel}>
                      Địa chỉ:
                      <input
                        className={`form-control`}
                        name="address"
                        onChange={(e) => {
                          inputField.address = e.target.value;
                        }}
                        spellCheck="false"
                      />
                    </label>
                  </>
                ) : (
                  <div style={{ marginBottom: "30px" }}>
                    <POISearchBar POISelected={setSelectedPOI} />
                  </div>
                )}
              </div>
              <div className="col-3">
                <button
                  type="button"
                  className={`btn ${style.customBtn}`}
                  onClick={toggleCustom}
                >
                  {showAddCustomModal ? "Chọn địa điểm" : "Hoạt động khác"}
                </button>
              </div>
            </div>
            <br />
            <div
              className={
                showWarningName
                  ? `${style.warningMessageName}`
                  : `${style.warningMessageName} ${style.hide}`
              }
            >
              Hãy chọn một địa điểm hoặc thêm một hoạt động của bạn.
            </div>
            <div className={`row ${style.addForm}`}>
              <label className="col-4">
                Ngày:
                <DatePicker
                  className="form-control"
                  minDate={allDates[0]}
                  maxDate={allDates[allDates.length - 1]}
                  selected={date}
                  onChange={(date) => {
                    setDate(date);
                    inputField.date = date.toISOString().split("T")[0];
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Chọn ngày đi"
                />
              </label>
              <label className="col-4">
                Giờ bắt đầu:
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
                Giờ kết thúc:
                <input
                  className="form-control"
                  defaultValue={"09:00"}
                  type="time"
                  name="end_time"
                  onChange={(e) => {
                    inputField.end_time = e.target.value;
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
            <div>
              <textarea
                className={`form-control ${style.noteInput}`}
                rows="3"
                onChange={(e) => {
                  inputField.note = e.target.value;
                }}
                maxLength={500}
                spellCheck="false"
              ></textarea>
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
            Thêm Hoạt Động
          </Button>
          <Button
            onClick={() => {
              closeModal();
            }}
            variant="outline-secondary"
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddActivityModal;
