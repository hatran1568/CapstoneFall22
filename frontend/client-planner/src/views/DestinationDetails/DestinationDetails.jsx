import React from "react";
import ReactDOM from "react-dom"
import {useState} from 'react';
import {useEffect} from 'react';
import {useParams } from 'react-router-dom';
import POIBox from '../../components/POIBox.jsx'
import MyGallery from './MyGallery.jsx'
import axios from "../../api/axios";
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
  } from "mdb-react-ui-kit";
import './DestinationDetails.css';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
function DestinationDetails(){
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');
    const [imgs, setImages] = useState([]);
    useEffect(() => {
        const listResp = async () => {
          await axios.get('http://localhost:8080/api/destination/images/' + id)
          .then(
            response => setImages(response.data))
        }
        listResp();
      }, []);
    const [destination, setDestination] = useState([]);
    useEffect(() => {
        const listResp = async () => {
          await axios.get('http://localhost:8080/api/destination/' + id)
          .then(
            response => setDestination(response.data))
        }
        listResp();
      }, []);
    const [pois, setPOIs] = useState([]);
    useEffect(() => {
        const listResp = async () => {
        await axios.get('http://localhost:8080/api/destination/first3POIs/' + id)
        .then(
            response => setPOIs(response.data))
        }
        listResp();
    }, []);
    const poiBox = [];
    pois.forEach((poi, index) => {
            poiBox.push(<POIBox name={poi.name} url={poi.image} rating={poi.googleRate} category={poi.categoryName} activityId={poi.activityId}/>)
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