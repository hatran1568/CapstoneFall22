import React from "react";
import ReactDOM from "react-dom"
import {useState} from 'react';
import {useEffect} from 'react';
import POIBox from '../../components/POIBox.jsx'
import MyGallery from './MyGallery.jsx'
import axios from "../../api/axios";
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
    MDBInput,
  } from "mdb-react-ui-kit";
import './DestinationDetails.css';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
function DestinationDetails(){
    const [imgs, setImages] = useState([]);
    useEffect(() => {
        const expensesListResp = async () => {
          await axios.get('http://localhost:8080/api/destination/images/1')
          .then(
            response => setImages(response.data))
        }
        expensesListResp();
      }, []);
    const [destination, setDestination] = useState([]);
    useEffect(() => {
        const expensesListResp = async () => {
          await axios.get('http://localhost:8080/api/destination/1')
          .then(
            response => setDestination(response.data))
        }
        expensesListResp();
      }, []);
    const [pois, setPOIs] = useState([]);
    useEffect(() => {
        const expensesListResp = async () => {
        await axios.get('http://localhost:8080/api/destination/first3POIs/1')
        .then(
            response => setPOIs(response.data))
        }
        expensesListResp();
    }, []);
    const poiBox = [];
    pois.forEach((poi, index) => {
            poiBox.push(<POIBox name={poi.name} url={poi.image} rating={poi.googleRating} category={poi.categoryName} activityId={poi.activityId}/>)
        });
    return(
        <MDBContainer className="container">
            <br/>
            <MDBCard className="contentbox"><br/>
                <h1 id="destinationName">Explore {destination.name}</h1><br/><br/>
                <MyGallery images={imgs}/>

                <MDBCardBody id="description">
                    {destination.description}    
                </MDBCardBody><br/><br/>
                <MDBCardBody className="container2">
                    <h3>Traveling to {destination.name}?</h3>
                    <MDBBtn className="button-2" role="button" id="generateTrip">Plan your trip</MDBBtn><br/><br/>
                    <h2 id="destinationName">Places and activities in {destination.name}</h2>
                </MDBCardBody>
                <MDBCardBody>
                  <MDBRow className="row">
                    {/* <POIBox name="Hồ Hoàn Kiếm" url="./assets/images/hanoi6.png" rating={4.3} category="Outdoors"/>
                    <POIBox name="Hồ Hoàn Kiếm" url="./assets/images/hanoi6.png" rating={4.3} category="Outdoors"/>
                    <POIBox name="Hồ Hoàn Kiếm" url="./assets/images/hanoi6.png" rating={4.3} category="Outdoors"/> */}
                    {poiBox}
                  </MDBRow>
                </MDBCardBody>
                <MDBCardBody className="container2">
                    <MDBBtn className="button-2" role="button" id="poiList">Find more places in {destination.name}</MDBBtn><br/><br/>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    )
}
export default DestinationDetails;