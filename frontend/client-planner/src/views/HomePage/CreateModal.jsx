import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "./generatemodal.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MDBBtn,
  MDBCol,
  MDBRow,
  MDBInput,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import { start } from "@popperjs/core";
function CreateModal(props) {
  const { onSubmit, closeCreateModal, ...rest } = props;

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [maxEndDate, setMaxEndDate] = useState();
  const submitTrip = (event) => {
    if (document.getElementById("budgetInput").value == "") {
      document.getElementById("errorEmptyPlan1").innerHTML =
        "Hãy nhập ngân sách.";
    } else if (document.getElementById("tripNameInput").value == "") {
      document.getElementById("errorEmptyPlan1").innerHTML =
        "Hãy nhập tên chuyến đi.";
    } else if (!endDate || !startDate) {
      document.getElementById("errorEmptyPlan1").innerHTML =
        "Hãy nhập ngày đi và ngày về.";
    } else if (startDate > endDate)
      document.getElementById("errorEmptyPlan1").innerHTML =
        "Ngày đi không thể ở sau ngày về.";
    else {
      var tzoffset = new Date().getTimezoneOffset() * 60000;
      let createData = {
        budget: document.getElementById("budgetInput").value,
        name: document.getElementById("tripNameInput").value,
        startDate: new Date(startDate - tzoffset)
          .toISOString()
          .substring(0, 10),
        endDate: new Date(endDate - tzoffset).toISOString().substring(0, 10),
      };
      onSubmit(createData);
    }
  };
  return (
    <Modal {...rest} size="lg" centered>
      <MDBModalHeader className={style.modalHeader}>
        <MDBModalTitle className={style.modalTitle}>
          Tạo chuyến đi mới
        </MDBModalTitle>
        <MDBBtn
          className="btn-close"
          color="none"
          onClick={closeCreateModal}
        ></MDBBtn>
      </MDBModalHeader>
      <MDBModalBody className={style.modalBody}>
        <div className={style.emptyTripInfo}>
          Tạo ra một chuyến đi trống.
          <br />
          Sao khi khởi tạo, bạn sẽ được chuyển tới chuyến đi và có thể tự tùy
          chỉnh theo ý muốn.
        </div>
        <br />
        <MDBRow className={style.modalInput}>
          <div className={style.formgroup}>
            <MDBInput
              label="Tên chuyến đi"
              type="text"
              id="tripNameInput"
              className={style.modalInput}
            />
          </div>
        </MDBRow>
        <br />
        <MDBRow className={style.modalInput}>
          <div className={style.formgroup}>
            <MDBInput
              label="Ngân sách (vnđ)"
              id="budgetInput"
              type="number"
              min={0}
              className={style.modalInput}
            />
          </div>
        </MDBRow>
        <br />
        <MDBRow className={style.modalInput}>
          <MDBCol className={style.formgroup}>
            <h6>Ngày đi</h6>
            {/* <MDBInput
              placeholder="Select date"
              type="date"
              id="startDateInput"
              className={style.datepicker}
            /> */}
            <DatePicker
              className="form-control"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                if (date > endDate) {
                  var newDate = new Date();
                  newDate.setTime(date.getTime());
                  setEndDate(newDate);
                }
                var newMaxDate = new Date();
                newMaxDate.setTime(date.getTime() + 13 * 1000 * 3600 * 24);
                setMaxEndDate(newMaxDate);
              }}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
              popperPlacement="bottom-start"
            />
          </MDBCol>
          <MDBCol className={style.formgroup}>
            <h6>Ngày về</h6>
            {/* <MDBInput
              placeholder="Select date"
              type="date"
              id="endDateInput"
              className={style.datepicker}
            /> */}
            <DatePicker
              disabled={!startDate}
              className="form-control"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="dd/MM/yyyy"
              popperPlacement="bottom-start"
            />
          </MDBCol>
          <div id="errorEmptyPlan1" className={style.errorEmptyPlan}></div>
        </MDBRow>
        <br />
      </MDBModalBody>

      <MDBModalFooter>
        <MDBBtn color="secondary" outline onClick={closeCreateModal}>
          Đóng
        </MDBBtn>
        <MDBBtn onClick={submitTrip} className={style.submitBtn}>
          Tạo chuyến đi
        </MDBBtn>
      </MDBModalFooter>
    </Modal>
  );
}
export default CreateModal;
