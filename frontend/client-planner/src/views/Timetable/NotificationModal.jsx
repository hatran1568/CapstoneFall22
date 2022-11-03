import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "./modals.module.css";
function NotificationModal(props) {
  const { onHide, message, ...rest } = props;
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
          <div className={style.deleteBody}>{message}</div>
          <div className={style.okBtnDiv}>
            <Button
              className={style.submitBtn}
              onClick={onHide}
              variant="outline-secondary"
            >
              OK
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NotificationModal;
