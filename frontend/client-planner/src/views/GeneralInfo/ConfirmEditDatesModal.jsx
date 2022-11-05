import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "./TripGeneralInfo.module.css";
function ConfirmEditModal(props) {
  const { onConfirmed, onHide, onCancel, message, ...rest } = props;
  return (
    <>
      <Modal
        {...rest}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <button
            className={`btn-close ${style.closeBtn}`}
            onClick={onHide}
          ></button>
          <div className={style.modalBody}>
            <div className={style.modalMessage}>
              <span>
                Bạn chắc chắn muốn chỉnh sửa thời gian cho chuyến đi của mình?
              </span>
              <br />
              <span>Các hoạt động đã được lên lịch có thể sẽ bị xóa.</span>
            </div>
            <div className={style.centerBtnGroup}>
              <Button
                variant="outline-dark"
                onClick={onConfirmed}
                className={style.submitBtn}
              >
                Xác nhận
              </Button>
              <Button onClick={onCancel} variant="outline-secondary">
                Hủy thay đổi
              </Button>
            </div>
            {/* <div className={style.modalMessage}>hoặc</div>
            <div className={style.centerBtnGroup}>
              <Button
                onClick={onHide}
                variant="outline-secondary"
                className={style.submitBtn}
              >
                Tạo một chuyến đi mới
              </Button>
            </div> */}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ConfirmEditModal;
