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
function CreateModal(props) {
  const { onSubmit, closeCreateModal, ...rest } = props;
  const submitTrip = (event) => {
    if (document.getElementById("budgetInput").value == "") {
      document.getElementById("errorEmptyPlan1").innerHTML =
        "Hãy nhập ngân sách.";
    } else if (document.getElementById("tripNameInput").value == "") {
      document.getElementById("errorEmptyPlan1").innerHTML =
        "Hãy nhập tên chuyến đi.";
    } else if (
      !document.getElementById("startDateInput").value ||
      !document.getElementById("endDateInput").value
    ) {
      document.getElementById("errorEmptyPlan1").innerHTML =
        "Hãy nhập ngày đi và ngày về.";
    } else if (
      document.getElementById("startDateInput").value >
      document.getElementById("endDateInput").value
    )
      document.getElementById("errorEmptyPlan1").innerHTML =
        "Ngày đi không thể ở sau ngày về.";
    else {
      let createData = {
        budget: document.getElementById("budgetInput").value,
        name: document.getElementById("tripNameInput").value,
        startDate: document.getElementById("startDateInput").value,
        endDate: document.getElementById("endDateInput").value,
      };
      onSubmit(createData);
    }
  };
  return (
    <Modal {...rest} size="lg" centered>
      <MDBModalHeader>
        <MDBModalTitle>Tạo chuyến đi mới</MDBModalTitle>
        <MDBBtn
          className="btn-close"
          color="none"
          onClick={closeCreateModal}
        ></MDBBtn>
      </MDBModalHeader>
      <MDBModalBody>
        <div className={style.emptyTripInfo}>
          Tạo ra một chuyến đi trống. Sao khi khởi tạo, bạn sẽ được chuyển tới
          chuyến đi và có thể tự tùy chỉnh theo ý muốn.
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
              label="Ngân sách"
              id="budgetInput"
              type="number"
              className={style.modalInput}
            />
          </div>
        </MDBRow>
        <br />
        <MDBRow className={style.modalInput}>
          <MDBCol className={style.formgroup}>
            <h6>Ngày đi</h6>
            <MDBInput
              placeholder="Select date"
              type="date"
              id="startDateInput"
              className={style.datepicker}
            />
          </MDBCol>
          <MDBCol className={style.formgroup}>
            <h6>Ngày về</h6>
            <MDBInput
              placeholder="Select date"
              type="date"
              id="endDateInput"
              className={style.datepicker}
            />
          </MDBCol>
          <div id="errorEmptyPlan1" className={style.errorEmptyPlan}></div>
        </MDBRow>
        <br />
      </MDBModalBody>

      <MDBModalFooter>
        <MDBBtn color="secondary" onClick={closeCreateModal}>
          Đóng
        </MDBBtn>
        <MDBBtn onClick={submitTrip}>Tạo chuyến đi</MDBBtn>
      </MDBModalFooter>
    </Modal>
  );
}
export default CreateModal;
