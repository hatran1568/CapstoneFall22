import {
  MDBCard,
  MDBCardBody,
  MDBCardGroup,
  MDBCardImage,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
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

  console.log(POIList);

  return (
    <>
      <MDBContainer>
        <h4>Places you saved in this collection</h4>
        <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
          {POIList
            ? POIList.map((poi) => (
                <MDBCol>
                  <MDBCard>
                    <MDBCardImage src={poi.poi.images[0].url} className={style.img} alt='...' position='top' />
                    <MDBCardBody>
                      <a href={"/poi?id=" + poi.poi.activityId} style={{ textDecoration: "none" }}>
                        <MDBCardTitle className='fs-6 text-center'>{poi.poi.name}</MDBCardTitle>
                        <MDBCardText className='text-muted text-center'>{poi.poi.category.categoryName}</MDBCardText>
                      </a>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              ))
            : null}
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default CollectionDetail;
