import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBIcon, MDBRow } from "mdb-react-ui-kit";
import style from "./CollectionInfoCard.module.css";
import { Modal } from "antd";

const CollectionInfoCard = (prop) => {
  const [isDeleted, setIsDeleted] = useState(prop.prop.isDeleted);
  const { confirm } = Modal;

  const handleDelete = () => {
    confirm({
      title: "Are you sure you want to delete " + prop.prop.title + "?",
      content: "This collection and all its contents will be deleted.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        axios
          .put(
            "/api/collection/delete",
            {
              id: prop.prop.collectionId,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              withCredentials: true,
            },
          )
          .then(setIsDeleted(true));
      },
    });
  };

  return isDeleted ? null : (
    <MDBCard border='dark' shadow='0' className='p-0 mb-3'>
      <MDBRow className='g-0'>
        <MDBCol sm='4'>
          <MDBCardImage
            src={
              prop.prop.image
                ? prop.prop.image
                : "https://i.picsum.photos/id/1000/5626/3635.jpg?hmac=qWh065Fr_M8Oa3sNsdDL8ngWXv2Jb-EE49ZIn6c0P-g"
            }
            fluid
          />
        </MDBCol>
        <MDBCol sm='7'>
          <MDBCardBody>
            <a className={style.link} href={"/collection?id=" + prop.prop.collectionId}>
              <h5>{prop.prop.title}</h5>
              <p>{prop.prop.description}</p>
            </a>
          </MDBCardBody>
        </MDBCol>
        <MDBCol sm='1'>
          <MDBBtn tag='a' color='none' className={style.deleteButton} onClick={handleDelete}>
            <MDBIcon far icon='trash-alt' size='lg' />
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </MDBCard>
  );
};

export default CollectionInfoCard;
