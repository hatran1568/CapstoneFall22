import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardText,
  MDBCardTitle,
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
        await axios
          .get("/location/api/collection/list/" + localStorage.getItem("id"))
          .then((res) => setColList(res.data));
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
        "/location/api/collection/addPoi2",
        {
          colId: colId,
          poiId: prop.poiId,
          uid: localStorage.getItem("id"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((res) => {
        setColList(res.data);
      });
  };

  const handleDelete = (colId) => {
    axios
      .delete("/location/api/collection/deletePoi2", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

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
          <MDBCol>
            <div
              overlay="true"
              className={style.img}
              style={
                col.imgUrl
                  ? {
                      backgroundImage: `url(${col.imgUrl})`,
                    }
                  : {
                      backgroundImage: `url("https://i.picsum.photos/id/1000/5626/3635.jpg?hmac=qWh065Fr_M8Oa3sNsdDL8ngWXv2Jb-EE49ZIn6c0P-g")`,
                    }
              }
            >
              <MDBCard className={style.card} style={{ border: "none" }}>
                <Tooltip title="Xóa địa điểm khỏi bộ sưu tập này">
                  <Checkbox
                    checked={true}
                    onClick={() => handleDelete(col.collectionId)}
                    className="ms-1"
                  />
                </Tooltip>
                <MDBCardBody className="mt-4 pt-5">
                  <MDBCardTitle className="fs-4 text-center text-white">
                    {col.title}
                  </MDBCardTitle>
                  <MDBCardText className="text-center text-white">
                    {col.description}
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </div>
          </MDBCol>,
        );
      } else {
        cols.push(
          <MDBCol>
            <div
              overlay="true"
              className={style.img}
              style={
                col.imgUrl
                  ? {
                      backgroundImage: `url(${col.imgUrl})`,
                    }
                  : {
                      backgroundImage: `url("https://i.picsum.photos/id/1000/5626/3635.jpg?hmac=qWh065Fr_M8Oa3sNsdDL8ngWXv2Jb-EE49ZIn6c0P-g")`,
                    }
              }
            >
              <MDBCard className={style.card} style={{ border: "none" }}>
                <Tooltip title="Thêm địa điểm vào bộ sưu tập này">
                  <Checkbox
                    checked={false}
                    onClick={() => handleAdd(col.collectionId)}
                    className="ms-1"
                  />
                </Tooltip>
                <MDBCardBody className="mt-4 pt-5">
                  <MDBCardTitle className="fs-4 text-center text-white">
                    {col.title}
                  </MDBCardTitle>
                  <MDBCardText className="text-center text-white">
                    {col.description}
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            </div>
          </MDBCol>,
        );
      }
    });
  }

  return (
    <>
      <MDBBtn
        tag="a"
        color="none"
        className={style.addCol}
        onClick={handleOpen}
      >
        <Tooltip title="Thêm địa điểm vào bộ sưu tập của bạn">
          <MDBIcon fas icon="heart" />
        </Tooltip>
      </MDBBtn>
      <Modal
        open={open}
        title="Các bộ sưu tập của bạn"
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{ paddingTop: "0" }}
      >
        <AddCollectionModal refresh={setColList} />
        <MDBRow className="row-cols-1 row-cols-md-2 g-4">{cols}</MDBRow>
      </Modal>
    </>
  );
};

export default AddPOIToCollectionModal;
