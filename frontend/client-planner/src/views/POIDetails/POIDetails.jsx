import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { MDBBtn, MDBCol, MDBContainer, MDBRow, MDBTextArea } from "mdb-react-ui-kit";
import StarRatings from "react-star-ratings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import ImageGallery from "react-image-gallery";
import { Input, Modal } from "antd";
import style from "./POIDetails.module.css";

const POIDetails = () => {
  const [curPOI, setCurPOI] = useState();
  const [ratings, setRatings] = useState([]);
  const [images, setImages] = useState([]);
  const [comment, setComment] = useState("");
  const [rate, setRate] = useState(0);

  const { TextArea } = Input;
  const { error } = Modal;

  const urlParams = new URLSearchParams(window.location.search);
  const poiId = urlParams.get("id");

  useEffect(() => {
    const getPOI = async () => {
      await axios.get("/api/pois/" + poiId).then((res) => setCurPOI(res.data));
    };

    const getRatings = async () => {
      await axios.get("/api/pois/" + poiId + "/ratings").then((res) => setRatings(res.data));
    };

    const getImages = async () => {
      await axios.get("/api/pois/" + poiId + "/images").then((res) => setImages(res.data));
    };

    document.title = "Trip planner | POIDetails";
    getPOI();
    getRatings();
    getImages();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleEdit = () => {
    if (rate > 0) {
      axios
        .put(
          "/api/pois/editRating",
          {
            rate: rate,
            comment: comment,
            userId: localStorage.getItem("id"),
            poiId: poiId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          },
        )
        .then((res) => {
          setRatings(res.data);
        });
    } else {
      error({
        title: "Can't change rating",
        content: "Please enter at least 1 star rating.",
      });
    }
  };

  const handleCreate = () => {
    if (rate > 0) {
      axios
        .post(
          "/api/pois/createRating",
          {
            rate: rate,
            comment: comment,
            userId: localStorage.getItem("id"),
            poiId: poiId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          },
        )
        .then((res) => {
          setRatings(res.data);
        });
    } else {
      error({
        title: "Can't create rating",
        content: "Please enter at least 1 star rating.",
      });
    }
  };

  var poiImages = [];
  if (images.length > 0) {
    images.forEach((image) => {
      poiImages.push({
        original: image,
        thumbnail: image,
      });
    });
  }

  var avgRate = 0;
  var poiRatings = [];
  if (ratings.length > 0) {
    avgRate = ratings.reduce((sum, cur) => sum + Number(cur.rate), 0) / ratings.length;
    ratings.forEach((rating) => {
      var formattedDate = new Date(rating.modified).toLocaleDateString("vi-VN");
      poiRatings.push(
        <>
          <MDBRow className='border-top'>
            <MDBCol size='auto' className='pe-0'>
              <StarRatings rating={rating.rate} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
            </MDBCol>
            <MDBCol size='auto' className='pt-1'>
              <p>
                {" "}
                by <strong>{rating.userName}</strong>
              </p>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <div>
              <p>{rating.comment}</p>
            </div>
          </MDBRow>
          <MDBRow className='border-bottom'>
            <p>Commented on {formattedDate}</p>
          </MDBRow>
        </>,
      );
    });
  } else if (ratings.length === 0) {
    poiRatings.push(
      <div>
        <p>There is still nothing yet</p>
      </div>,
    );
  }

  var ratingInput;
  var commented;
  if (ratings.length > 0) {
    commented = ratings.some((rate) => {
      if (rate.userId == localStorage.getItem("id")) {
        return true;
      } else {
        return false;
      }
    });
  }

  if (commented) {
    ratingInput = (
      <MDBCol className='mt-3'>
        <p className='fs-3 mb-1'>Edit your feedback:</p>
        <StarRatings
          numberOfStars={5}
          changeRating={setRate}
          rating={rate}
          starDimension='1em'
          starSpacing='0.1em'
          starRatedColor='orange'
          starHoverColor='orange'
        />
        <TextArea
          id='comment-rating'
          showCount
          maxLength={500}
          className='mt-2'
          style={{ height: 120, resize: "none" }}
          placeholder='Share your thoughts about this place...'
          onChange={handleChange}
        />
        <MDBBtn color='info' className='mt-2' onClick={handleEdit}>
          Edit
        </MDBBtn>
      </MDBCol>
    );
  } else {
    ratingInput = (
      <MDBCol className='mt-3'>
        <p className='fs-3 mb-1'>Write a feedback:</p>
        <StarRatings
          numberOfStars={5}
          changeRating={setRate}
          rating={rate}
          starDimension='1em'
          starSpacing='0.1em'
          starRatedColor='orange'
          starHoverColor='orange'
        />
        <TextArea
          id='comment-rating'
          showCount
          maxLength={500}
          className='mt-2'
          style={{ height: 120, resize: "none" }}
          placeholder='Share your thoughts about this place...'
          onChange={handleChange}
        />
        <MDBBtn color='info' className='mt-2' onClick={handleCreate}>
          Comment
        </MDBBtn>
      </MDBCol>
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
      <MDBContainer className={style.container}>
        <MDBRow className='pb-3 pt-5'>
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
        <MDBRow className='pb-4'>
          <MDBCol size='8'>
            <ImageGallery items={poiImages} showPlayButton={false} />
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

        <MDBRow className='pb-3'>
          <h2 className='fw-bold'>{curPOI.name} reviews</h2>
        </MDBRow>
        <MDBRow className='pb-4'>
          <MDBCol size='4'>
            <MDBRow>
              <MDBCol size='auto'>
                <p className={style.text}>{avgRate.toString().padEnd(3, ".0")}</p>
              </MDBCol>
              <MDBCol size='auto' className='pt-md-1'>
                <StarRatings rating={avgRate} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
              </MDBCol>
              <MDBCol size='auto' className='pt-md-2 px-lg-0'>
                <p>
                  {ratings.length} {ratings.length > 1 ? "reviews" : "review"}
                </p>
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <MDBCol>
            {poiRatings}
            {ratingInput}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
};

export default POIDetails;
