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
  const [titleInput, setTitleInput] = useState(prop.collection.title);
  const [descriptionInput, setDescriptionInput] = useState(
    prop.collection.description,
  );
  const { confirm } = Modal;

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
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
          title = "Không có tiêu đề";
        }
        if (descriptionInput.trim().length > 0) {
          description = descriptionInput.trim();
        } else {
          description = "";
        }

        axios
          .put(
            "/location/api/collection/edit",
            {
              id: prop.collection.collectionId,
              title: title,
              description: description,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          )
          .then((res) => {
            prop.refresh({
              title: res.data.title,
              description: res.data.description,
            });
            handleCancel();
          });
      },
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  console.log(prop.collection);

  return (
    <>
      <button className={`${style.editBtn}`} onClick={(e) => handleEdit(e)}>
        <MDBIcon fas icon="pencil-alt" size="lg" />
      </button>
      <Modal
        title="Chỉnh sửa thông tin bộ sưu tập"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={"Hủy"}
        okText="Lưu"
      >
        <MDBInputGroup className="px-2 mb-3">
          <h5>Tiêu đề</h5>
          <Input
            showCount
            maxLength={30}
            onChange={(e) => {
              setTitleInput(e.target.value);
            }}
            size="large"
            spellCheck="false"
            defaultValue={prop.collection.title}
          />
        </MDBInputGroup>
        <MDBInputGroup className="px-2">
          <h5>Mô tả</h5>
          <TextArea
            showCount
            rows={3}
            onChange={(e) => {
              setDescriptionInput(e.target.value);
            }}
            maxLength={100}
            style={{ width: 1000, resize: "none" }}
            spellCheck="false"
            defaultValue={prop.collection.description}
          />
        </MDBInputGroup>
      </Modal>
    </>
  );
};

export default EditCollectionModal;
