import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "./modals.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faC, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
function EditItemModal(props) {
  const { onSubmit, onHide, item, ...rest } = props;
  const [checked, setChecked] = useState(item.checked == true);
  const [content, setContent] = useState(item.content);
  //   setInputField();
  const submit = (event) => {
    const data = {
      itemId: item.itemId,
      content: content,
      checked: checked,
    };
    onSubmit(data);
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
            onClick={onHide}
          ></button>
          <div className={style.modalBody}>
            <div className={style.modalTitle}>
              {item.content ? item.content : ""}
            </div>
            {checked ? (
              <Button
                variant="outline-dark"
                onClick={(event) => {
                  setChecked(!checked);
                }}
                className={style.submitBtn}
              >
                Đã xong <FontAwesomeIcon icon={faCheck} />
              </Button>
            ) : (
              <Button
                variant="outline-dark"
                onClick={(event) => {
                  setChecked(!checked);
                }}
                className={style.uncheckedBtn}
              >
                Chưa xong
              </Button>
            )}
            <div>
              <input
                type="text"
                className={`form-control ${style.inputContent}`}
                defaultValue={item.content}
                placeholder="Nội dung"
                onChange={(e) => {
                  content = e.target.value;
                }}
              />
              <textarea
                className={`form-control ${style.inputContent}`}
                placeholder="Ghi chú"
                rows={3}
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
