import React, { useState } from "react";
import { Modal } from "antd";
import { MDBBtn, MDBIcon, MDBInputGroup, MDBRow } from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/lib/input/TextArea";
import Input from "antd/lib/input/Input";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import style from "./AddCollectionModal.module.css";

const AddCollectionModal = (prop) => {
  const [open, setOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const { confirm } = Modal;
  const navigate = useNavigate();

  const handleCreate = () => {
    setOpen(true);
  };

  const handleOk = () => {
    confirm({
      title: "Đồng ý tạo mới?",
      content: "Bạn sẽ khởi tạo một bộ sưu tập mới.",
      okText: "Có",
      okType: "primary",
      cancelText: "Không",
      centered: true,
      onOk() {
        var title;
        var description;
        if (titleInput.trim().length > 0) {
          title = titleInput.trim();
        } else {
          title = "Không có tiêu đề";
        }
        if (descriptionInput.trim().length > 0) {
          description = descriptionInput.trim();
        } else {
          description = "";
        }

        axios
          .post(
            "/location/api/collection/create",
            {
              uid: localStorage.getItem("id"),
              title: title,
              description: description,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          )
          .then((response) => {
            prop.refresh(response.data);
            handleCancel();
          });
      },
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <div className='d-flex justify-content-end'>
        <a className={`${style.btnAdd} btn btn-success`} onClick={handleCreate}>
          <FontAwesomeIcon icon={faPlus} className={style.addIcon} size='lg' />
          Tạo mới
        </a>
      </div>
      <Modal title='Bộ sưu tập mới' open={open} onOk={handleOk} onCancel={handleCancel}>
        <MDBInputGroup className='px-2 mb-3'>
          <h5>Tiêu đề</h5>
          <Input
            showCount
            maxLength={30}
            onChange={(e) => {
              setTitleInput(e.target.value);
            }}
            size='large'
            spellCheck='false'
          />
        </MDBInputGroup>
        <MDBInputGroup className='px-2'>
          <h5>Mô tả</h5>
          <TextArea
            showCount
            rows={3}
            onChange={(e) => {
              setDescriptionInput(e.target.value);
            }}
            maxLength={100}
            style={{ width: 1000, resize: "none" }}
            spellCheck='false'
          />
        </MDBInputGroup>
      </Modal>
    </>
  );
};

export default AddCollectionModal;
