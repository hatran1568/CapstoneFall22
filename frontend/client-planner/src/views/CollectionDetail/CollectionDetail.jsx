import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardGroup,
  MDBCardImage,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import axios from "../../api/axios";
import style from "./CollectionDetail.module.css";

const CollectionDetail = () => {
  const [POIList, setPOIList] = useState([]);

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

    document.title = "Trip planner | Collection Details";
    getPOIList();
  }, []);

  return (
    <>
      <MDBContainer>
        <h4>Places you saved in this collection</h4>
        <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
          {POIList
            ? POIList.map((poi) => (
                <MDBCol>
                  <a href={"/poi?id=" + poi.poi.activityId} style={{ textDecoration: "none" }}>
                    <MDBCard className='h-100'>
                      <div className={style.img} style={{ backgroundImage: `url(${poi.poi.images[0].url})` }} />
                      <MDBCardBody>
                        <MDBCardTitle className='fs-6 text-center'>{poi.poi.name}</MDBCardTitle>
                        <MDBCardText className='text-muted text-center'>{poi.poi.category.categoryName}</MDBCardText>
                      </MDBCardBody>
                      <MDBCardFooter border='0'>
                        <MDBCardText className='text-center'>
                          <StarRatings
                            rating={poi.poi.googleRate}
                            starDimension='1em'
                            starSpacing='0.1em'
                            starRatedColor='orange'
                          />
                        </MDBCardText>
                      </MDBCardFooter>
                    </MDBCard>
                  </a>
                </MDBCol>
              ))
            : null}
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default CollectionDetail;
