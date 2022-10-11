import React from "react";
import axios from "../../api/axios";
import {useState} from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
    MDBInput,
  } from "mdb-react-ui-kit";
import './CreateEmptyPlan.css';
function CreateEmptyPlan() {
    // Get the modal
    const [isShown, setIsShown] = useState(false);

    const handleClick = event => {
        // toggle visibility
        setIsShown(current => !current);
    };
    const clickOut = event => {
        // toggle visibility
        setIsShown(false);
    };
    const submitTrip = event => {
        axios({
            method: 'post',
            url: 'http://localhost:8080/trip/createTrip',
            data: {
                budget: document.getElementById("budgetInput").value,
                name: document.getElementById("tripNameInput").value,
                startDate: document.getElementById("startDateInput").value,
                endDate: document.getElementById("endDateInput").value
            },
            headers: {
                'Content-Type': 'application/json'
            }
          });
    };
    return (
        <MDBContainer>
            <MDBBtn className="button-2" role="button" id="myBtn" onClick={handleClick}>Create an empty Trip</MDBBtn>

            <MDBCard id="myModal" className="modal" style={{display: isShown ? 'block' : 'none'}}>

                <MDBCardBody className="modal-content">
                    <h2>Create an Empty trip</h2>
                    <MDBRow className="row">
                        <div md="2"></div>
                        <div md="8" className="form-group">
                            <h5>Trip Name</h5>
                            <MDBInput type="text" id="tripNameInput" className="form-control"/>
                        </div>
                    </MDBRow>
                    <MDBRow className="row">
                        <div md="2"></div>
                        <div md="8" className="form-group">
                            <h5>Budget</h5>
                            <MDBInput id="budgetInput" type="text" className="form-control"/>
                        </div>
                    </MDBRow><br/>
                    <MDBRow className="row">
                        <MDBCol md="2"></MDBCol>
                        <MDBCol md="3" className="form-group">
                            <h6>Start date</h6>
                            <MDBInput placeholder="Select date" type="date" id="startDateInput" className="datepicker" value="2022-10-01"/>
                        </MDBCol>
                        <MDBCol md="2"></MDBCol>
                        <MDBCol md="3" className="form-group">
                            <h6>End date</h6>
                            <MDBInput placeholder="Select date" type="date" id="endDateInput" className="datepicker" value="2022-10-02"/>
                        </MDBCol>
                    </MDBRow><br/>
                    <MDBBtn className="button-2" role="button" onClick={submitTrip}>Create trip</MDBBtn>
                    <MDBBtn className="button-2" role="button" onClick={clickOut}>Cancel</MDBBtn>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    )
}
export default CreateEmptyPlan;