import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "./modals.module.css";
function ConfirmDeleteModal(props) {
  const { onConfirmed, onHide, itemId, message, ...rest } = props;
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
        </Modal.Body>
        <Modal.Footer>
          <div className={style.centerBtnGroup}>
            <Button
              variant="outline-dark"
              onClick={(event) => {
                onConfirmed(event, itemId);
              }}
              className={style.submitBtn}
            >
              Xóa
            </Button>
            <Button onClick={onHide} variant="outline-secondary">
              Hủy
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ConfirmDeleteModal;
