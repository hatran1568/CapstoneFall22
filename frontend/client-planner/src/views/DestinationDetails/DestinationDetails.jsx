import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import POIBox from "../../components/POIs/POIBox.jsx";
import MyGallery from "../../components/POIs/MyGallery.jsx";
import axios from "../../api/axios";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
} from "mdb-react-ui-kit";
import style from "./DestinationDetails.module.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
function DestinationDetails() {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const [imgs, setImages] = useState([]);
  useEffect(() => {
    try {
      const listResp = async () => {
        await axios
          .get("http://localhost:8080/location/api/destination/images/" + id)
          .then((response) => setImages(response.data));
      };
      listResp();
    } catch (error) {
      console.log(error);
    }
  }, []);
  const [destination, setDestination] = useState([]);
  useEffect(() => {
    try {
      const listResp = async () => {
        await axios
          .get("http://localhost:8080/location/api/destination/" + id)
          .then((response) => setDestination(response.data));
      };
      listResp();
    } catch (error) {
      console.log(error);
    }
  }, []);
  if (destination.deleted == true) window.location.href = "/";
  const [pois, setPOIs] = useState([]);
  useEffect(() => {
    try {
      const listResp = async () => {
        await axios
          .get(
            "http://localhost:8080/location/api/destination/first3POIs/" + id,
          )
          .then((response) => setPOIs(response.data));
      };
      listResp();
    } catch (error) {
      console.log(error);
    }
  }, []);
  const poiBox = [];
  pois.forEach((poi, index) => {
    poiBox.push(
      <POIBox
        name={poi.name}
        url={poi.image}
        rating={poi.googleRate}
        category={poi.categoryName}
        activityId={poi.activityId}
      />,
    );
  });
  const poiLink = "./Destination/POIs?desid=" + id + "&catid=0&rating=0";
  document.title = "Khám phá " + destination.name + " | Tripplanner";
  return (
    <MDBContainer className={style.container}>
      <br />
      <MDBContainer className={style.contentbox}>
        <br />
        <h1>Khám phá {destination.name}</h1>
        <br />
        <br />
        <MyGallery images={imgs} />

        <MDBCardBody>{destination.description}</MDBCardBody>
        <br />
        <br />
        <MDBCardBody className={style.container2}>
          <h3>Du lịch tới {destination.name}?</h3>
          <MDBBtn href="../" className={style.button2} id="generateTrip">
            Lên kế hoạch
          </MDBBtn>
          <br />
          <br />
          <h2>Địa điểm và hoạt động tại {destination.name}</h2>
        </MDBCardBody>
        <MDBCardBody>
          <MDBRow className={style.row}>{poiBox}</MDBRow>
        </MDBCardBody>
        <MDBCardBody className={style.container2}>
          <br />
          <a href={poiLink}>
            <MDBBtn className={style.button2} id="poiList">
              Tìm thêm địa điểm tại {destination.name}
            </MDBBtn>
          </a>
          <br />
          <br />
        </MDBCardBody>
      </MDBContainer>
    </MDBContainer>
  );
}
export default DestinationDetails;
