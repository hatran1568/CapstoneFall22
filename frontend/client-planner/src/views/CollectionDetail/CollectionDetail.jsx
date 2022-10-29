import {
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
import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import axios from "../../api/axios";
import style from "./CollectionDetail.module.css";

const CollectionDetail = () => {
  const [POIList, setPOIList] = useState([]);
  const [curCol, setCurCol] = useState();

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

  if (curCol !== undefined) {
    return (
      <>
        <MDBContainer>
          <MDBRow className='mt-md-5'>
            <h3>
              <MDBIcon far icon='bookmark' /> Your collection: {curCol.title}
            </h3>
          </MDBRow>
          <hr />
          <MDBRow>
            {curCol.description === "" ? <p className="fs-5">There is no description yet.</p> : <p className="fs-5">Description: {curCol.description}</p>}
          </MDBRow>
          <MDBRow>
            <h4>Places you saved in this collection</h4>
          </MDBRow>
          <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
            {POIList
              ? POIList.map((poi) => (
                  <MDBCol>
                    <a href={"/poi?id=" + poi.poi.activityId} style={{ textDecoration: "none" }}>
                      <div
                        overlay='true'
                        className={style.img}
                        style={{ backgroundImage: `url(${poi.poi.images[0].url})` }}
                      >
                        <MDBCard className={style.card} style={{ border: "none" }}>
                          <MDBCardBody className='mt-5 pt-5'>
                            <MDBCardTitle className='fs-4 text-center text-white'>{poi.poi.name}</MDBCardTitle>
                          </MDBCardBody>
                          <MDBCardFooter border='0'>
                            <MDBCardText className='text-center text-white'>
                              <StarRatings
                                rating={poi.poi.googleRate}
                                starDimension='1em'
                                starSpacing='0.1em'
                                starRatedColor='orange'
                              />
                            </MDBCardText>
                            <MDBCardText className='text-white text-center'>
                              {poi.poi.category.categoryName}
                            </MDBCardText>
                          </MDBCardFooter>
                        </MDBCard>
                      </div>
                    </a>
                  </MDBCol>
                ))
              : null}
          </MDBRow>
        </MDBContainer>
      </>
    );
  }
};

export default CollectionDetail;
