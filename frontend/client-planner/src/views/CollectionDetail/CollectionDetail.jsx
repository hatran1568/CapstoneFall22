import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardGroup,
  MDBCardImage,
  MDBCardOverlay,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
} from "mdb-react-ui-kit";
import { Modal } from "antd";
import StarRatings from "react-star-ratings";
import axios from "../../api/axios";
import POISearchBar from "../../components/POISearchBar/POISearchBar";
import style from "./CollectionDetail.module.css";

const CollectionDetail = () => {
  const [POIList, setPOIList] = useState([]);
  const [curCol, setCurCol] = useState();
  const [open, setOpen] = useState(false);

  const { confirm } = Modal;
  const { error } = Modal;
  const urlParams = new URLSearchParams(window.location.search);
  const colId = urlParams.get("id");

  useEffect(() => {
    const getPOIList = async () => {
      const response = await axios.get("/api/collection/poiList/" + colId, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      setPOIList(response.data);
    };

    const getCurCol = async () => {
      const response = await axios.get("/api/collection/get/" + colId, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      setCurCol(response.data);
    };

    document.title = "Trip planner | Collection Details";
    getCurCol();
    getPOIList();
  }, []);

  const handleAdd = () => {
    setOpen(true);
  };

  var id;
  const setSelectedPOI = (item) => {
    id = item.id;
  };

  const handleOk = () => {
    var poi = POIList.filter((item) => item.activityId === id);
    if (poi.length === 0) {
      axios
        .post(
          "/api/collection/addPoi",
          {
            colId: curCol.collectionId,
            poiId: id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          },
        )
        .then((res) => {
          setPOIList(res.data);
          setOpen(false);
        });
    } else {
      error({
        title: "Error",
        content: "This place already exists in the collection.",
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDelete = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    confirm({
      title: "Confirm delete?",
      content: "This point of interest will be removed from the collection.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      onOk() {
        axios
          .delete("/api/collection/deletePoi", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
            data: {
              colId: curCol.collectionId,
              poiId: item,
            },
          })
          .then((res) => {
            setPOIList(res.data);
          });
      },
    });
  };

  if (curCol !== undefined) {
    var header;
    if (curCol.imgUrl !== null) {
      header = (
        <div overlay='true' style={{ backgroundImage: `url(${curCol.imgUrl})`, backgroundSize: "cover" }}>
          <div className={style.header}>
            <div className='row mt-3'>
              <h3 className={style.text}>{curCol.title}</h3>
            </div>
            <div className='row mb-5 pb-3'>
              {curCol.description === "" ? (
                <p className={style.text}>There is no description yet.</p>
              ) : (
                <p className={style.text}>{curCol.description}</p>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      header = (
        <div className={style.header}>
          <div className='row mt-3'>
            <h3 className={style.text}>{curCol.title}</h3>
          </div>
          <div className='row mb-5 pb-3'>
            {curCol.description === "" ? (
              <p className={style.text}>There is no description yet.</p>
            ) : (
              <p className={style.text}>{curCol.description}</p>
            )}
          </div>
        </div>
      );
    }
    return (
      <>
        {header}
        <MDBContainer className='mt-5'>
          <MDBRow className='mb-3'>
            <h4>Places you saved in this collection</h4>
          </MDBRow>
          <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
            {POIList ? (
              POIList.map((poi) => (
                <MDBCol key={poi.activityId}>
                  <a href={"/poi?id=" + poi.activityId} style={{ textDecoration: "none" }}>
                    <div overlay='true' className={style.img} style={{ backgroundImage: `url(${poi.imgUrl})` }}>
                      <MDBCard className={style.card} style={{ border: "none" }}>
                        <div className='d-flex justify-content-end pe-2 pt-2'>
                          <MDBBtn
                            tag='a'
                            color='none'
                            className={style.delBtn}
                            onClick={(e) => handleDelete(e, poi.activityId)}
                          >
                            <MDBIcon far icon='trash-alt' size="lg"/>
                          </MDBBtn>
                        </div>
                        <MDBCardBody className='mt-5 pt-5'>
                          <MDBCardTitle className='fs-4 text-center text-white'>{poi.name}</MDBCardTitle>
                        </MDBCardBody>
                        <MDBCardFooter border='0'>
                          <div className='text-center'>
                            <StarRatings
                              rating={poi.googleRate}
                              starDimension='1em'
                              starSpacing='0.1em'
                              starRatedColor='orange'
                            />
                          </div>
                          <MDBCardText className='text-white text-center'>{poi.category}</MDBCardText>
                        </MDBCardFooter>
                      </MDBCard>
                    </div>
                  </a>
                </MDBCol>
              ))
            ) : (
              <p className={style.text}>Add a place you like into the collection</p>
            )}
            <MDBCol>
              <div
                className='h-100 w-100 d-flex align-items-center justify-content-center'
                style={{ minHeight: "250px" }}
              >
                <MDBBtn tag='a' color='none' className={`${style.btn}`} onClick={handleAdd}>
                  <MDBIcon fas icon='plus-circle' style={{ fontSize: "5em" }} />
                </MDBBtn>
                <Modal title='Find a point of interest' open={open} onOk={handleOk} onCancel={handleCancel}>
                  <POISearchBar POISelected={setSelectedPOI} />
                </Modal>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </>
    );
  }
};

export default CollectionDetail;