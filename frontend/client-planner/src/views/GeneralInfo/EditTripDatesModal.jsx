import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "./TripGeneralInfo.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ConfirmEditModal from "./ConfirmEditDatesModal";
import { start } from "@popperjs/core";
function EditTripDatesModal(props) {
  const { onChange, onHide, trip, ...rest } = props;
  const [startDate, setStartDate] = useState(new Date(trip.startDate));
  const [endDate, setEndDate] = useState(new Date(trip.endDate));
  const [showConfirm, setShowConfirm] = useState(false);
  const handleHide = () => {
    setShowConfirm(false);
  };
  const handleConfirmed = () => {
    setShowConfirm(false);
    const data = {
      tripId: trip.tripId,
      startDate: startDate.toISOString().substring(0, 10),
      endDate: endDate.toISOString().substring(0, 10),
    };
    onChange(data);
  };
  const onSave = () => {
    if (
      startDate > new Date(trip.startDate) ||
      endDate < new Date(trip.endDate)
    )
      setShowConfirm(true);
    else handleConfirmed();
  };
  const handleCancel = () => {
    handleHide();
    setStartDate(new Date(trip.startDate));
    setEndDate(new Date(trip.endDate));
    onHide();
  };
  const onCancel = () => {
    setStartDate(new Date(trip.startDate));
    setEndDate(new Date(trip.endDate));
    onHide();
  };
  const diff =
    new Date(trip.endDate).getDate() - new Date(trip.startDate).getDate();
  return (
    <>
      <ConfirmEditModal
        show={showConfirm}
        onConfirmed={handleConfirmed}
        onHide={handleHide}
        message={""}
        onCancel={handleCancel}
      />
      <Modal
        {...rest}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className={style.modalHeader}>
          <div className={style.modalTitle}>
            Chỉnh sửa thời gian cho chuyến đi của bạn
          </div>
          <button
            className={`btn-close ${style.closeBtn}`}
            onClick={onCancel}
          ></button>
        </Modal.Header>
        <Modal.Body className={style.editModal}>
          <div className={style.editModalBody}>
            <div className="row">
              <div className="col-6">
                <span className={style.formLabel}>Ngày bắt đầu: </span>
                <DatePicker
                  className="form-control"
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    if (date > endDate) {
                      var newDate = new Date();
                      newDate.setDate(date.getDate() + diff);
                      setEndDate(newDate);
                    }
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-start"
                />
              </div>
              <div className="col-6">
                <span className={style.formLabel}>Ngày kết thúc: </span>
                <DatePicker
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
              </div>
            </div>
            <div className={style.btnGroup}>
              <Button
                variant="outline-dark"
                onClick={onSave}
                className={style.submitBtn}
              >
                Lưu
              </Button>
              <Button onClick={onCancel} variant="outline-secondary">
                Hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditTripDatesModal;
