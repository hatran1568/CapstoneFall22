import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBIcon, MDBRow } from "mdb-react-ui-kit";
import { Modal } from "antd";
import EditCollectionModal from "./EditCollectionModal";
import style from "./CollectionInfoCard.module.css";

const CollectionInfoCard = (prop) => {
  const [isDeleted, setIsDeleted] = useState(prop.collection.isDeleted);
  const [info, setInfo] = useState({
    title: prop.collection.title,
    description: prop.collection.description,
  });
  const { confirm } = Modal;

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    confirm({
      title: "Đồng ý xóa " + prop.collection.title + "?",
      content: "Bộ sưu tập này cùng toàn bộ các địa điểm đã lưu sẽ bị xóa.",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        axios
          .put(
            "/location/api/collection/delete",
            {
              id: prop.collection.collectionId,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          )
          .then(setIsDeleted(true));
      },
    });
  };

  const formatDate = (jsonString) => {
    var options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(jsonString).toLocaleDateString("vi-VN", options);
  };

  return isDeleted ? null : (
    <>
      <MDBCard className={`${style.card}`} style={{ border: 0 }}>
        <a className={style.link} href={"/collection?id=" + prop.collection.collectionId}>
          <MDBRow>
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
            <MDBCol sm='8'>
              <h5 className='mt-4'>{info.title}</h5>
              <p className='mt-2 mb-0'>{info.description}</p>
              <small className='text-mute' style={{ position: "absolute", bottom: "2vh", color: "rgb(175, 175, 175)" }}>
                <i>Chỉnh sửa: {formatDate(prop.collection.dateModified)}</i>
              </small>
            </MDBCol>
            <MDBCol sm='1'>
              <div className='mt-4'>
                <button className={`${style.deleteBtn}`} onClick={(e) => handleDelete(e)}>
                  <MDBIcon far icon='trash-alt' size='lg' />
                </button>
              </div>
              <div className='mt-4'>
                <EditCollectionModal collection={prop.collection} refresh={setInfo}/>
              </div>
            </MDBCol>
          </MDBRow>
        </a>
      </MDBCard>
    </>
  );
};

export default CollectionInfoCard;
