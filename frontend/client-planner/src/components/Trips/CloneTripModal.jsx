import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "../../views/GeneralInfo/TripGeneralInfo.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../api/axios";
function CloneTripModal(props) {
  const { onSubmit, onHide, tripId, tripStartDate, tripEndDate, ...rest } =
    props;
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const diff =
    new Date(tripEndDate).getDate() - new Date(tripStartDate).getDate();
  const close = () => {
    setStartDate();
    onHide();
  };
  const submit = () => {
    var tzoffset = new Date().getTimezoneOffset() * 60000;
    var formattedDate = new Date(startDate - tzoffset)
      .toISOString()
      .substring(0, 10);
    if (tripId && localStorage.getItem("id")) {
      axios
        .post(`/trip/clone-trip`, {
          tripId: tripId,
          startDate: formattedDate,
          userId: localStorage.getItem("id"),
        })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            window.location.href = "../timeline/" + res.data.tripId;
          }
        });
    } else close();
  };
  return (
    <>
      <Modal
        {...rest}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className={style.cloneModal}>
          <button
            className={`btn-close ${style.closeBtn}`}
            onClick={close}
          ></button>
          <div className={style.cloneModalBody}>
            <div className={style.cloneModalTitle}>
              Biến nó thành chuyến đi của bạn
            </div>
            <div className="row">
              <div className="col-6">
                <div>Ngày bắt đầu:</div>
                <DatePicker
                  className="form-control"
                  onChange={(date) => {
                    setStartDate(date);
                    var newDate = new Date();
                    newDate.setDate(date.getDate() + diff);
                    setEndDate(newDate);
                  }}
                  selected={startDate}
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-start"
                  minDate={new Date()}
                  placeholderText="Chọn ngày bắt đầu"
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
              <div className="col-6">
                <div>Ngày kết thúc:</div>
                <DatePicker
                  className="form-control"
                  selected={endDate}
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-start"
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  disabled
                  placeholderText="Ngày kết thúc"
                />
              </div>
            </div>
            <div className={style.cloneBtnGroup}>
              <Button
                variant="outline-dark"
                onClick={submit}
                className={style.submitBtn}
                disabled={startDate == null}
              >
                Lưu
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CloneTripModal;
