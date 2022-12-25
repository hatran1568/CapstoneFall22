import React from "react";
import { useState } from "react";
import style from "./POIBox.module.css";
import Rating from "./Rating.jsx";
import { MDBCard, MDBCardBody } from "mdb-react-ui-kit";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

class POIBox extends React.Component {
  render() {
    const link = "../poi?id=" + this.props.activityId;
    return (
      <MDBCard className={style.poiBox}>
        <a href={link} className={style.poiBoxLink}>
          <img className={style.boxImg} src={this.props.url} />
          <MDBCardBody>
            <h4 className={style.boxName}>{this.props.name}</h4>
            <Rating ratings={this.props.rating} />
            <div className={style.catText}>{this.props.category}</div>
          </MDBCardBody>
        </a>
      </MDBCard>
    );
  }
}
export default POIBox;
