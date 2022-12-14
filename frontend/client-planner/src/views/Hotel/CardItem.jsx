import React from "react";
import {
  MDBCard,
  MDBCardTitle,
  MDBCardText,
  MDBCardSubTitle,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import StarRatings from "react-star-ratings";
import style from "./CardItem.module.css";

function CardItem(props) {
  return (
    <MDBCard className={style.item}>
      <MDBRow className="g-0">
        <MDBCol md="4">
          <MDBCardImage
            className={style.image}
            src={props.item.thumbnail}
            alt="..."
            fluid
          />
        </MDBCol>
        <MDBCol md="8">
          <MDBCardBody className={style.cardBody}>
            <MDBCardTitle>
              <div>{props.item.name}</div>
              <StarRatings
                style="height:15px;"
                starDimension="15px"
                starSpacing="1px"
                rating={props.item.rate / 2}
                starRatedColor="green"
              ></StarRatings>
            </MDBCardTitle>
            <MDBCardSubTitle>
              <small className="text-muted">
                {props.item.numberOfRate == 0
                  ? " "
                  : props.item.numberOfRate + " reviews"}
              </small>
            </MDBCardSubTitle>
            <MDBCardText>
              <small className="text-muted">{props.item.price + " ₫"}</small>
            </MDBCardText>
            <div className={style.hotelBtnGroup}>
              <button
                type="button"
                className={`${style.hotelBtn} ${style.hotelChangeBtn}`}
                onClick={() => {
                  window.location.href = "../poi?id=" + props.item.id;
                }}
              >
                Chi tiết
              </button>
              <button
                type="button"
                className={`${style.hotelBtn} ${style.hotelBookBtn}`}
                onClick={() => {
                  if (props.item.website.length > 0)
                    window.open(props.item.website);
                }}
              >
                Đặt chỗ
              </button>
              <button
                type="button"
                className={`${style.hotelBtn} ${style.hotelBookBtn}`}
                onClick={(event) => props.addHotel(event)}
              >
                Thêm
              </button>
            </div>
          </MDBCardBody>
        </MDBCol>
      </MDBRow>
    </MDBCard>
  );
}

export default CardItem;
