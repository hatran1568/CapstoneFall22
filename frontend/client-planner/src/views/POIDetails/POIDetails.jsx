import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBIcon,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import StarRatings from "react-star-ratings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import MyGallery from "../../components/POIs/MyGallery.jsx";
import { Dropdown, Input, Menu, Modal, Tooltip } from "antd";
import style from "./POIDetails.module.css";
import AddPOIToCollectionModal from "../../components/POIs/AddPOIToCollectionModal";

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
  }, [poiId]);

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
      if (minutes > 0) {
        timeString = hours.toString() + " giờ " + minutes.toString() + " phút";
      } else {
        timeString = hours.toString() + " giờ";
      }
    }

    return timeString;
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
          setRate(0);
          setComment("");
        });
    } else {
      error({
        title: "Lỗi đánh giá",
        content: "Xin hãy đánh giá ít nhất 1 sao cho địa điểm.",
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
          setRate(0);
        });
    } else {
      error({
        title: "Lỗi đánh giá",
        content: "Xin hãy đánh giá ít nhất 1 sao cho địa điểm.",
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
  var userRating = [];
  if (ratings.length > 0) {
    avgRate = ratings.reduce((sum, cur) => sum + Number(cur.rate), 0) / ratings.length;
    ratings.forEach((rating) => {
      var formattedDate = new Date(rating.modified).toLocaleDateString("vi-VN");
      if (rating.userId != localStorage.getItem("id")) {
        poiRatings.push(
          <>
            <MDBRow className='border-top'>
              <MDBCol size='auto' className='pe-0'>
                <StarRatings rating={rating.rate} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
              </MDBCol>
              <MDBCol size='auto' className='pt-1'>
                <p>
                  {" "}
                  <strong>{rating.userName}</strong>
                </p>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <div>
                <p>{rating.comment}</p>
              </div>
            </MDBRow>
            <MDBRow className='border-bottom'>
              <p>Thời gian bình luận: {formattedDate}</p>
            </MDBRow>
          </>,
        );
      } else if (rating.userId == localStorage.getItem("id")) {
        userRating.push(
          <>
            <MDBRow className='border-top'>
              <MDBCol size='auto' className='pe-0'>
                <StarRatings rating={rating.rate} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
              </MDBCol>
              <MDBCol size='auto' className='pt-1'>
                <p>
                  {" "}
                  <strong>{rating.userName}</strong>
                </p>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <div>
                <p>{rating.comment}</p>
              </div>
            </MDBRow>
            <MDBRow className='border-bottom'>
              <p>Thời gian bình luận: {formattedDate}</p>
            </MDBRow>
          </>,
        );
      }
    });
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
      <MDBCol>
        <p className='fs-3 mb-1'>Thay đổi đánh giá của bạn:</p>
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
          showCount
          maxLength={500}
          className='mt-2'
          style={{ height: 120, resize: "none" }}
          placeholder='Chia sẻ trải nghiệm của bạn về nơi này'
          onChange={handleChange}
          value={comment}
        />
        <MDBBtn color='info' className='mt-2' onClick={handleEdit}>
          Edit
        </MDBBtn>
      </MDBCol>
    );
  } else {
    ratingInput = (
      <MDBCol>
        <p className='fs-3 mb-1'>Chia sẻ đánh giá của bạn:</p>
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
          showCount
          maxLength={500}
          className='mt-2'
          style={{ height: 120, resize: "none" }}
          placeholder='Chia sẻ trải nghiệm của bạn về nơi này'
          onChange={handleChange}
          value={comment}
        />
        <MDBBtn color='info' className='mt-2' onClick={handleCreate}>
          Gửi
        </MDBBtn>
      </MDBCol>
    );
  }

  if (curPOI !== undefined && curPOI.category !== undefined && !curPOI.deleted) {
    return (
      <MDBContainer className={style.container}>
        <MDBRow className='pb-3 pt-5'>
          <MDBRow>
            <MDBCol size='auto' className='pe-0'>
              <h2 className='fw-bold'>{curPOI.name}</h2>
            </MDBCol>
            <MDBCol size='auto'>
              {localStorage.getItem("token") != null ? <AddPOIToCollectionModal poiId={curPOI.activityId} /> : null}
            </MDBCol>
          </MDBRow>
          <MDBRow className='m-0'>
            <MDBCol size='auto' className='p-0'>
              <StarRatings rating={curPOI.googleRate} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
            </MDBCol>
            <MDBCol size='auto' className='pt-1'>
              <p>
                {curPOI.googleRate} xếp hạng bởi <FontAwesomeIcon icon={faGoogle} /> Maps |{" "}
                {curPOI.category.categoryName}
              </p>
            </MDBCol>
          </MDBRow>
        </MDBRow>
        <MDBRow className='pb-1'>
          <MDBCol size='8'>
            <MyGallery images={poiImages} />
            <p>{curPOI.description}</p>
          </MDBCol>
          <MDBCol size='4'>
            <p className='fs-5 fw-bold'>Thời gian mở cửa:</p>
            <p>
              {timeConverter(curPOI.openTime, "hh:mm")} - {timeConverter(curPOI.closeTime, "hh:mm")}
            </p>
            <p className='fs-5 fw-bold'>Thời gian thăm quan đề xuất:</p>
            <p>{timeConverter(curPOI.duration, "x hours y minutes")}</p>
            <p className='fs-5 fw-boldfs-5 fw-bold'>Địa chỉ:</p>
            <p>{curPOI.address}</p>
            {curPOI.phone ? (
              <>
                <p className='fs-5 fw-bold'>Điện thoại:</p>
                <p>{curPOI.phone}</p>
              </>
            ) : (
              <></>
            )}
            {curPOI.businessEmail ? (
              <>
                <p className='fs-5 fw-bold'>Email:</p>
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
          </MDBCol>
        </MDBRow>
        <MDBRow className='pb-5'>
          <a className={style.requestLink} href={"./poi/request?id=" + poiId}>
            <b>
              <i>Phát hiện thông tin sai? Bấm vào đây để yêu cầu sửa đổi</i>
            </b>
          </a>
        </MDBRow>
        <MDBRow className='pb-3'>
          <h2 className='fw-bold'>Đánh giá về {curPOI.name}</h2>
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
            {ratingInput}
            <MDBRow className='mt-4'>
              <p className='fs-4 fw-bold'>Đánh giá của bạn:</p>
            </MDBRow>
            {userRating.length > 0 ? userRating : <p>Bạn vẫn chưa có đánh giá về địa điểm này.</p>}
            <MDBRow className='mt-5'>
              <p className='fs-4 fw-bold'>Đánh giá của người dùng:</p>
            </MDBRow>
            {poiRatings.length > 0 ? poiRatings : <p>Địa điểm này vẫn chưa được mọi người đánh giá.</p>}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  } else {
    return (
      <MDBContainer>
        <h2>Địa điểm này không tồn tại.</h2>
      </MDBContainer>
    );
  }
};

export default POIDetails;
