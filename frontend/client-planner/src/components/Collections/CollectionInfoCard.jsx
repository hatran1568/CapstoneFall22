import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBIcon, MDBRow } from "mdb-react-ui-kit";
import { Modal } from "antd";
import EditCollectionModal from "./EditCollectionModal";
import style from "./CollectionInfoCard.module.css";

const CollectionInfoCard = (prop) => {
  const [isDeleted, setIsDeleted] = useState(prop.collection.isDeleted);
  const [info, setInfo] = useState({ title: prop.collection.title, description: prop.collection.description });
  const { confirm } = Modal;

  const handleDelete = () => {
    confirm({
      title: "Are you sure you want to delete " + prop.collection.title + "?",
      content: "This collection and all its contents will be deleted.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      onOk() {
        axios
          .put(
            "/api/collection/delete",
            {
              id: prop.collection.collectionId,
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

  const formatDate = (jsonString) => {
    return new Date(jsonString).toLocaleDateString("en-IE");
  };

  return isDeleted ? null : (
    <>
      <MDBCard shadow='0' style={{ border: "none" }}>
        <MDBRow className='g-0'>
          <MDBCol sm='3'>
            <MDBCardImage
              className={style.img}
              src={
                prop.collection.imgUrl
                  ? prop.collection.imgUrl
                  : "https://i.picsum.photos/id/1000/5626/3635.jpg?hmac=qWh065Fr_M8Oa3sNsdDL8ngWXv2Jb-EE49ZIn6c0P-g"
              }
              fluid
            />
          </MDBCol>
          <MDBCol sm='7'>
            <a className={style.link} href={"/collection?id=" + prop.collection.collectionId}>
              <MDBCardBody className='h-100'>
                <p className='fs-5 fw-bold mt-4'>{info.title}</p>
                <p className='mt-2 mb-0'>{info.description}</p>
                <small className='text-mute' style={{ position: "absolute", bottom: "2vh" }}>
                  <i>Last updated: {formatDate(prop.collection.dateModified)}</i>
                </small>
              </MDBCardBody>
            </a>
          </MDBCol>
          <MDBCol sm='1' className='d-flex flex-column'>
            <div className='mt-5'>
              <EditCollectionModal id={prop.collection.collectionId} refresh={setInfo} />
            </div>
            <div className='mt-5'>
              <button className={`${style.deleteBtn}`} onClick={handleDelete}>
                <MDBIcon far icon='trash-alt' size='lg' />
              </button>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </>
  );
};

export default CollectionInfoCard;
