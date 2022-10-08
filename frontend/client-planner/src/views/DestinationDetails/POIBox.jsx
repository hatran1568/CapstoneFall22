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
    return (
      <MDBCard className="poiBox"><br/>
        <img className="boxImg" src={this.props.url}/>
        <h2>{this.props.name}</h2>
        <Rating ratings={this.props.rating}/>
        <div className="catText">{this.props.category}</div><br/>
      </MDBCard>
    )
  }
}
export default POIBox;