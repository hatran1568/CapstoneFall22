import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { MDBCarousel, MDBCarouselItem, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import StarRatings from "react-star-ratings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import style from "./POIDetails.module.css";

const POIDetails = () => {
  const [curPOI, setCurPOI] = useState();
  const [ratings, setRatings] = useState([]);
  const [images, setImages] = useState([]);

  const urlParams = new URLSearchParams(window.location.search);
  const poiId = urlParams.get("id");

  useEffect(() => {
    document.title = "Trip planner | POIDetails";
  }, []);

  useEffect(() => {
    const getPOI = async () => {
      await axios.get("http://localhost:8080/api/pois/" + poiId).then((res) => setCurPOI(res.data));
    };
    getPOI();
  }, []);

  useEffect(() => {
    const getRatings = async () => {
      await axios.get("http://localhost:8080/api/pois/" + poiId + "/ratings").then((res) => setRatings(res.data));
    };
    getRatings();
  }, []);

  useEffect(() => {
    const getImages = async () => {
      await axios.get("http://localhost:8080/api/pois/" + poiId + "/images").then((res) => setImages(res.data));
    };
    getImages();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
  };

  const poiImages = [];
  if (images.length > 1) {
    images.forEach((image) => poiImages.push(<MDBCarouselItem className='w-100 d-block' src={image} alt='...' />));
  } else if (images.length == 1) {
    poiImages.push(
      <>
        <MDBCarouselItem className='w-100 d-block' src={images[0]} alt='...' />
        <MDBCarouselItem className='w-100 d-block' src={images[0]} alt='...' />
      </>,
    );
  }

  const poiRatings = [];
  if (ratings.length > 0 && ratings !== undefined) {
    ratings.forEach((rating, index) =>
      poiRatings.push(
        <>
          <MDBRow>
            <MDBCol size='auto' className='pe-0'>
              <StarRatings rating={rating.rate} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
            </MDBCol>
            <MDBCol size='auto' className='pt-1'>
              <p>
                {" "}
                by <strong>{rating.user.name}</strong>
              </p>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <div>
              <p>{rating.comment}</p>
            </div>
          </MDBRow>
        </>,
      ),
    );
  } else if (ratings.length == 0) {
    poiRatings.push(
      <div>
        <p>There is still nothing yet</p>
      </div>,
    );
  }

  const timeConverter = (seconds, format) => {
    var dateObj = new Date(seconds * 1000);
    var hours = dateObj.getUTCHours();
    var minutes = dateObj.getUTCMinutes();
    var timeString;

    if (format === "hh:mm") {
      if (hours > 12) {
        timeString = (hours - 12).toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + " pm";
      } else {
        timeString = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + " am";
      }
    } else if (format === "x hours y minutes") {
      timeString = hours.toString() + " hours " + minutes.toString() + " minutes";
    }

    return timeString;
  };

  if (curPOI !== undefined) {
    return (
      <MDBContainer className='px-5'>
        <MDBRow className='mb-3'>
          <h2 className='fw-bold'>{curPOI.name}</h2>
          <MDBRow className='m-0'>
            <MDBCol size='auto' className='p-0'>
              <StarRatings rating={curPOI.googleRate} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
            </MDBCol>
            <MDBCol size='auto' className='pt-1'>
              <p>
                {curPOI.googleRate} stars on <FontAwesomeIcon icon={faGoogle} /> Maps | {curPOI.category.categoryName}
              </p>
            </MDBCol>
          </MDBRow>
        </MDBRow>
        <MDBRow className='mb-4'>
          <MDBCol size='8'>
            <MDBCarousel showControls className='mb-3'>
              {poiImages}
            </MDBCarousel>
            <p>{curPOI.description}</p>
          </MDBCol>
          <MDBCol size='4'>
            <p className='fs-5 fw-bold'>Open hours:</p>
            <p>
              {timeConverter(curPOI.openTime, "hh:mm")} - {timeConverter(curPOI.closeTime, "hh:mm")}
            </p>
            <p className='fs-5 fw-bold'>Recommended duration:</p>
            <p>{timeConverter(curPOI.duration, "x hours y minutes")}</p>
            <p className='fs-5 fw-boldfs-5 fw-bold'>Address:</p>
            <p>{curPOI.address}</p>
            {curPOI.phone ? (
              <>
                <p className='fs-5 fw-bold'>Phone number:</p>
                <p>{curPOI.phone}</p>
              </>
            ) : (
              <></>
            )}
            {curPOI.businessEmail ? (
              <>
                <p className='fs-5 fw-bold'>Business email:</p>
                <p>{curPOI.businessEmail}</p>
              </>
            ) : (
              <></>
            )}
            {curPOI.website ? (
              <>
                <p className='fs-5 fw-bold'>Website:</p>
                <p>{curPOI.website}</p>
              </>
            ) : (
              <></>
            )}
            <button className='btn btn-info' onClick={handleClick}>
              Generate plans to this place
            </button>
          </MDBCol>
        </MDBRow>

        <MDBRow className='mb-3'>
          <h2 className='fw-bold'>{curPOI.name} reviews</h2>
        </MDBRow>
        <MDBRow className='mb-4'>{poiRatings}</MDBRow>
      </MDBContainer>
    );
  }
};

export default POIDetails;
