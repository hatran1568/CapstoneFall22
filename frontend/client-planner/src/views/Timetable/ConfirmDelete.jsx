import React, { Component, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import POISearchBar from "../../components/POISearchBar/POISearchBar";
import style from "./modals.module.css";
function AddActivityModal(props) {
  const { onConfirmed, onHide, detailId, ...rest } = props;
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
          <div className={style.deleteBody}>
            Bạn chắc chắn muốn xóa hoạt động <strong>{rest.name}</strong>?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-dark"
            onClick={(event) => {
              onConfirmed(event, detailId);
            }}
            className={style.submitBtn}
          >
            Xóa
          </Button>
          <Button onClick={onHide} variant="outline-secondary">
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddActivityModal;
