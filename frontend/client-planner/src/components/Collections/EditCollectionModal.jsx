import React, { useState } from "react";
import { Modal } from "antd";
import { MDBBtn, MDBIcon, MDBInputGroup, MDBRow } from "mdb-react-ui-kit";
import TextArea from "antd/lib/input/TextArea";
import Input from "antd/lib/input/Input";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import style from "./EditCollectionModal.module.css";

const EditCollectionModal = (prop) => {
  const [open, setOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const { confirm } = Modal;

  const handleEdit = () => {
    setOpen(true);
  };

  const handleOk = () => {
    confirm({
      title: "Đồng ý?",
      content: "Thông tin sẽ được cập nhật",
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
          title = "Untitled";
        }
        if (descriptionInput.trim().length > 0) {
          description = descriptionInput.trim();
        } else {
          description = "";
        }

        axios
          .put(
            "/api/collection/edit",
            {
              id: prop.id,
              title: title,
              description: description,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              withCredentials: true,
            },
          )
          .then((res) => {
            prop.refresh({ title: res.data.title, description: res.data.description });
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
      <button className={`${style.editBtn}`} onClick={handleEdit}>
        <MDBIcon far icon='edit' size='lg' />
      </button>
      <Modal title='Chỉnh sửa thông tin bộ sưu tập' open={open} onOk={handleOk} onCancel={handleCancel}>
        <MDBInputGroup className='px-2 mb-3'>
          <p className='fs-5 fw-bold'>Tiêu đề</p>
          <Input
            showCount
            maxLength={30}
            onChange={(e) => {
              setTitleInput(e.target.value);
            }}
            size='large'
          />
        </MDBInputGroup>
        <MDBInputGroup className='px-2'>
          <p className='fs-5 fw-bold'>Mô tả</p>
          <TextArea
            showCount
            rows={3}
            onChange={(e) => {
              setDescriptionInput(e.target.value);
            }}
            maxLength={100}
            style={{ width: 1000, resize: "none" }}
          />
        </MDBInputGroup>
      </Modal>
    </>
  );
};

export default EditCollectionModal;
