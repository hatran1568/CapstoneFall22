import React from "react";
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

    // // Get the button that opens the modal
    // var btn = document.getElementById("myBtn");

    // // When the user clicks on the button, open the modal
    // btn.onclick = function() {
    //     modal.style.display = "block";
    // }
    // // When the user clicks anywhere outside of the modal, close it
    // window.onclick = function(event) {
    //     if (event.target == modal) {
    //     modal.style.display = "none";
    //     }
    // }
    return (
        <MDBContainer>
            <MDBBtn className="button-2" role="button" id="myBtn" onClick={handleClick}>Create an empty Trip</MDBBtn>

            <MDBCard id="myModal" className="modal" style={{display: isShown ? 'block' : 'none'}}>

                <MDBCardBody className="modal-content">
                    <span className="close">&times;</span>
                    <h2>Create an Empty trip</h2>
                    <MDBRow className="row">
                        <div md="2"></div>
                        <div md="8" className="form-group">
                            <h5>Destination</h5>
                            <MDBInput id="destinationInput" type="text" className="form-control"/>
                        </div>
                    </MDBRow><br/>
                    <MDBRow className="row">
                        <div md="2"></div>
                        <div md="8" className="form-group">
                            <h5>Trip Name</h5>
                            <MDBInput type="text" id="tripNameInput" className="form-control"/>
                        </div>
                    </MDBRow>
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
                    <MDBBtn className="button-2" role="button">Create trip</MDBBtn>
                    <MDBBtn className="button-2" role="button" onClick={clickOut}>Cancel</MDBBtn>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    )
}
export default CreateEmptyPlan;