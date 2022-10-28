import React, { useState } from "react";
import { Modal } from "antd";
import { MDBBtn, MDBIcon, MDBInputGroup, MDBRow } from "mdb-react-ui-kit";
import TextArea from "antd/lib/input/TextArea";
import Input from "antd/lib/input/Input";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AddCollectionModal = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const { confirm } = Modal;
  const navigate = useNavigate();

  const handleCreate = () => {
    setOpen(true);
  };

  const handleOk = () => {
    confirm({
      title: "Confirm create?",
      content: "A new collection will be added",
      okText: "Yes",
      okType: "primary",
      cancelText: "No",
      onOk() {
        var title;
        var description;
        if (titleInput.trim().length > 0) {
          title = titleInput.trim();
        } else {
          title = "Untitled collection";
        }
        if (descriptionInput.trim().length > 0) {
          description = descriptionInput.trim();
        } else {
          description = "";
        }
  
        axios
          .post(
            "/api/collection/create",
            {
              uid: localStorage.getItem("id"),
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
          .then((response) => navigate("/collection/details?id=" + response.data.collectionId));
      },
    });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <MDBBtn color='primary' onClick={handleCreate}>
        <MDBIcon fas icon='plus-circle' /> Create new...
      </MDBBtn>
      <Modal
        title='Create new collection'
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <MDBInputGroup className='px-2 mb-3'>
          <p className='fs-5 fw-bold'>Title</p>
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
          <p className='fs-5 fw-bold'>Description</p>
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
