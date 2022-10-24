import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardText,
  MDBCardTitle,
  MDBCarousel,
  MDBCarouselItem,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import StarRatings from "react-star-ratings";
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

  const timeConverter = (seconds) => {
    var dateObj = new Date(seconds * 1000);
    var hours = dateObj.getUTCHours();
    var minutes = dateObj.getUTCMinutes();

    var timeString = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
    return timeString;
  };

  if (curPOI !== undefined /*&& !images.isEmpty() && !ratings.isEmpty()*/) {
    return (
      <MDBContainer>
        <MDBRow className='mb-3'>
          <h2 className='fw-bold'>{curPOI.name}</h2>
          <StarRatings rating={curPOI.googleRate} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
          <p>
            {curPOI.googleRate} on Google Maps | {curPOI.category.categoryName}
          </p>
        </MDBRow>
        <MDBRow className='mb-4'>
          <MDBCol size='8'>
            <MDBCarousel showControls className='mb-3'>
              {/*{images &&
                images.map((item, index) => {
                  <MDBCarouselItem
                    className='w-100 d-block'
                    itemId={index}
                    src={item.url}
                    alt='...'
                  />;
                })}*/}
              <MDBCarouselItem
                className='w-100 d-block'
                itemId={1}
                src='https://mdbootstrap.com/img/new/slides/041.jpg'
                alt='...'
              />
              <MDBCarouselItem
                className='w-100 d-block'
                itemId={2}
                src='https://mdbootstrap.com/img/new/slides/042.jpg'
                alt='...'
              />
              <MDBCarouselItem
                className='w-100 d-block'
                itemId={3}
                src='https://mdbootstrap.com/img/new/slides/043.jpg'
                alt='...'
              />
            </MDBCarousel>
            {/*<p>{curPOI.description}</p>*/}
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero, ea! Quam deserunt cumque tenetur
              doloremque et nostrum nisi beatae ratione. Laudantium deleniti ea similique unde nobis eum error, mollitia
              quo sunt perspiciatis qui consectetur doloremque fugit nulla ipsum blanditiis quos magni quidem ex ipsam
              exercitationem eligendi fuga molestiae! Harum quis eligendi aliquid facilis similique reiciendis ducimus,
              cumque dignissimos neque aperiam nesciunt dolorem quibusdam labore? Cumque provident doloremque, unde
              iste, voluptates odit nisi et dicta nobis facere nulla tempora quos excepturi explicabo illum vero.
              Consequuntur omnis aperiam, nihil corrupti consectetur, ipsum enim quam fugit, quas illo est dolore
              explicabo impedit libero?
            </p>
          </MDBCol>
          <MDBCol size='4'>
            <p className='fs-5 fw-bold'>Open hours:</p>
            <p>
              {timeConverter(curPOI.openTime)} - {timeConverter(curPOI.closeTime)}
            </p>
            <br />
            <p className='fs-5 fw-bold'>Recommended duration:</p>
            <p>{timeConverter(curPOI.duration)}</p>
            <br />
            <p className='fs-5 fw-boldfs-5 fw-bold'>Address:</p>
            <p>{curPOI.address}</p>
            <br />
            {curPOI.phone ? (
              <>
                <p className='fs-5 fw-bold'>Phone number:</p>
                <p>{curPOI.phone}</p>
                <br />
              </>
            ) : (
              <></>
            )}
            {curPOI.businessEmail ? (
              <>
                <p className='fs-5 fw-bold'>Business email:</p>
                <p>{curPOI.businessEmail}</p>
                <br />
              </>
            ) : (
              <></>
            )}
            {curPOI.website ? (
              <>
                <p className='fs-5 fw-bold'>Website:</p>
                <p>{curPOI.website}</p>
                <br />
              </>
            ) : (
              <></>
            )}
            <button className='btn btn-link' onClick={handleClick}>
              Generate plans to this place &gt;&gt;.
            </button>
          </MDBCol>
        </MDBRow>

        <MDBRow className='mb-3'>
          <h2 className='fw-bold'>{curPOI.name} reviews</h2>
        </MDBRow>
        <MDBRow className='mb-4'>
          {/*{ratings &&
            ratings.map((item, index) => {
              <div className='mb-2'>
                <h4>{item.name}</h4>
                <div>
                  <StarRatings rating={item.rate} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
                  <p>{item.Comment}</p>
                </div>
                <p className='text-muted'>{item.dateCreated}</p>
              </div>;
            })}*/}
          <div className='mb-2'>
            <h4>Tourist A</h4>
            <div>
              <StarRatings rating={4} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero, ea! Quam deserunt cumque tenetur
                doloremque et nostrum nisi beatae ratione.
              </p>
            </div>
            <p className='text-muted'>20/10/2022</p>
          </div>
          <div className='mb-2'>
            <h4>Tourist B</h4>
            <div>
              <StarRatings rating={3} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero, ea! Quam deserunt cumque tenetur
                doloremque et nostrum nisi beatae ratione.
              </p>
            </div>
            <p className='text-muted'>20/10/2022</p>
          </div>
          <div className='mb-2'>
            <h4>Tourist C</h4>
            <div>
              <StarRatings rating={5} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero, ea! Quam deserunt cumque tenetur
                doloremque et nostrum nisi beatae ratione.
              </p>
            </div>
            <p className='text-muted'>20/10/2022</p>
          </div>
          <div className='mb-2'>
            <h4>Tourist D</h4>
            <div>
              <StarRatings rating={4} starDimension='1em' starSpacing='0.1em' starRatedColor='orange' />
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero, ea! Quam deserunt cumque tenetur
                doloremque et nostrum nisi beatae ratione.
              </p>
            </div>
            <p className='text-muted'>20/10/2022</p>
          </div>
        </MDBRow>
      </MDBContainer>
    );
  }
};

export default POIDetails;
