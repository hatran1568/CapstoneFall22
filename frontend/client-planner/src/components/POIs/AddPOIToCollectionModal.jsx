import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  MDBBtn,
  MDBCheckbox,
  MDBCol,
  MDBContainer,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { Button, Checkbox, Dropdown, Input, Menu, Modal, Tooltip } from "antd";
import style from "./AddPOIToCollectionModal.module.css";
import AddCollectionModal from "../Collections/AddCollectionModal";
import CollectionInfoCard from "../Collections/CollectionInfoCard";

const AddPOIToCollectionModal = (prop) => {
  const [open, setOpen] = useState(false);
  const [colList, setColList] = useState([]);

  useEffect(() => {
    const getColList = async () => {
      if (localStorage.getItem("token") != undefined) {
        await axios.get("/api/collection/list/" + localStorage.getItem("id")).then((res) => setColList(res.data));
      }
    };

    getColList();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleAdd = (colId) => {
    axios
      .post(
        "/api/collection/addPoi2",
        {
          colId: colId,
          poiId: prop.poiId,
          uid: localStorage.getItem("id"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        },
      )
      .then((res) => {
        setColList(res.data);
      });
  };

  const handleDelete = (colId) => {
    axios
      .delete("/api/collection/deletePoi2", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
        data: {
          colId: colId,
          poiId: prop.poiId,
          uid: localStorage.getItem("id"),
        },
      })
      .then((res) => {
        setColList(res.data);
      });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  var cols = [];
  if (colList.length > 0) {
    colList.forEach((col) => {
      if (col.poiList.some((poi) => poi.activityId === prop.poiId)) {
        cols.push(
          <MDBRow>
            <Tooltip title='Xóa địa điểm khỏi bộ sưu tập này'>
              <Checkbox checked={true} onClick={() => handleDelete(col.collectionId)} />
            </Tooltip>
            <CollectionInfoCard collection={col} />
          </MDBRow>,
        );
      } else {
        cols.push(
          <MDBRow>
            <Tooltip title='Thêm địa điểm vào bộ sưu tập này'>
              <Checkbox checked={false} onClick={() => handleAdd(col.collectionId)} />
            </Tooltip>
            <CollectionInfoCard collection={col} />
          </MDBRow>,
        );
      }
    });
  }

  return (
    <>
      <MDBBtn tag='a' color='none' className={style.addCol} onClick={handleOpen}>
        <Tooltip title='Thêm địa điểm vào bộ sưu tập của bạn'>
          <MDBIcon fas icon='heart' />
        </Tooltip>
      </MDBBtn>
      <Modal
        open={open}
        title='Các bộ sưu tập của bạn'
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{ paddingTop: "0" }}
      >
        <AddCollectionModal refresh={setColList} />
        {cols}
      </Modal>
    </>
  );
};

export default AddPOIToCollectionModal;
