import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "./modals.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faC, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
function EditItemModal(props) {
  const { onSubmit, onHide, item, ...rest } = props;
  var clone = JSON.parse(JSON.stringify(item));
  const [title, setTitle] = useState(clone.title);
  const [note, setNote] = useState(clone.note);
  const [showWarningTitle, setShowWarningTitle] = useState(false);
  const submit = (event) => {
    if (title == "") {
      setShowWarningTitle(true);
      return;
    }
    if (title == item.title && note == item.note) {
      onHide();
    } else {
      let data = {
        itemId: item.itemId,
        title: title,
        note: note,
        checked: clone.checked,
      };
      onSubmit(event, data);
    }
  };
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
            <div className={style.modalTitle}>
              {item.title ? item.title : ""}
            </div>
            <div>
              <div>
                <input
                  type="text"
                  className={`form-control ${style.inputContent}`}
                  defaultValue={item.title}
                  placeholder="Nội dung"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <div
                  className={
                    showWarningTitle
                      ? `${style.warningMessage}`
                      : `${style.warningMessage} ${style.hide}`
                  }
                >
                  Tiêu đề không được để trống.
                </div>
              </div>
              <textarea
                className={`form-control ${style.inputNote}`}
                placeholder="Ghi chú"
                rows={3}
                defaultValue={item.note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              ></textarea>
            </div>
          </div>
          <div className={style.centerBtnGroup}>
            <Button
              variant="outline-dark"
              onClick={(event) => {
                submit(event);
              }}
              className={style.submitBtn}
            >
              Lưu
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditItemModal;
