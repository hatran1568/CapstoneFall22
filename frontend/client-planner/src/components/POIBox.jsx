import React from "react";
import {useState} from 'react';
import "./POIBox.css"
import Rating from './Rating.jsx';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
    MDBInput,
  } from "mdb-react-ui-kit";
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

class POIBox extends React.Component {
  render() {    
    const link = "link here/" + this.props.activityId;
    return (
      <MDBCard className="poiBox"><br/>
        <a href={link}>
          <MDBCardBody>
            <img className="boxImg" src={this.props.url}/>
            <h3 className="boxName">{this.props.name}</h3>
            <Rating ratings={this.props.rating}/>
            <div className="catText">{this.props.category}</div><br/>
          </MDBCardBody>
        </a>
      </MDBCard>
    )
  }
}
export default POIBox;