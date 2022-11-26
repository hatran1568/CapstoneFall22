import React, { useState } from "react";
import { Modal } from "antd";
import { MDBBtn, MDBIcon, MDBInputGroup, MDBRow } from "mdb-react-ui-kit";
import TextArea from "antd/lib/input/TextArea";
import Input from "antd/lib/input/Input";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

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
            }
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
      <MDBBtn
        tag="a"
        color="none"
        className="m-2"
        onClick={handleCreate}
        style={{ textDecoration: "none" }}
      >
        <MDBIcon fas icon="plus-circle" /> Tạo mới
      </MDBBtn>
      <Modal
        title="Bộ sưu tập mới"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <MDBInputGroup className="px-2 mb-3">
          <p className="fs-5 fw-bold">Tiêu đề</p>
          <Input
            showCount
            maxLength={30}
            onChange={(e) => {
              setTitleInput(e.target.value);
            }}
            size="large"
          />
        </MDBInputGroup>
        <MDBInputGroup className="px-2">
          <p className="fs-5 fw-bold">Mô tả</p>
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

export default AddCollectionModal;
