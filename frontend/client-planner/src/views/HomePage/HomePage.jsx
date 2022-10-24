import React from "react";
import axios from "../../api/axios";
import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBBtnGroup,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBInput,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import style from "./HomePage.module.css";

function HomePage() {
    const navigate = useNavigate();
    const [basicModal, setBasicModal] = useState(false);

  const toggleShow = () => {
    setBasicModal(!basicModal);
    document.getElementById("budgetInput").value = "";
    document.getElementById("tripNameInput").value = "";
    document.getElementById("startDateInput").value = null;
    document.getElementById("endDateInput").value = null;
    document.getElementById("errorEmptyPlan").innerHTML = "";
  };
    const submitTrip = event => {
      if (document.getElementById("budgetInput").value=="" || document.getElementById("tripNameInput").value=="" ||
      !document.getElementById("startDateInput").value || !document.getElementById("endDateInput").value)
        {
          document.getElementById("errorEmptyPlan").innerHTML = "Please enter all fields.";
        }
      else if (document.getElementById("startDateInput").value > document.getElementById("endDateInput").value)
      document.getElementById("errorEmptyPlan").innerHTML = "Please enter valid dates.";
      else
      axios({
          method: 'post',
          url: 'http://localhost:8080/trip/createTrip',
          data: {
              userId: localStorage.getItem("id"),
              budget: document.getElementById("budgetInput").value,
              name: document.getElementById("tripNameInput").value,
              startDate: document.getElementById("startDateInput").value,
              endDate: document.getElementById("endDateInput").value
          },
          headers: {
              'Content-Type': 'application/json'
          }
        }).then(function (response) {
          navigate("../Timeline/" + response.data);
          window.location.reload(false);
        });
    };
  return (
    <>
      <div className='bg-image'>
        <img
          src='https://myhugesavings.com/wp-content/uploads/revslider/travelslider/travel-page-bg.jpg'
          className={style.img}
          height='auto'
          width='100%'
          alt='travel'
        />
        <div className='mask' style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}>
          <div className={style.splashContainer}>
            <div className={style.splash}>
              <div className='px-5' id={style["splash-text"]}>
                <h2 className='text-dark text-center'>Make planning great!</h2>
                <p className='text-muted text-center'>Ease your head on decisions.</p>
                <MDBBtnGroup className={style.btn}>
                  <MDBBtn color='info'>Generate&nbsp;trip</MDBBtn>
                  {/* <MDBBtn color='info'>Create&nbsp;trip</MDBBtn> */}
                  <MDBBtn color='info' onClick={toggleShow}>Create Trip</MDBBtn>
                </MDBBtnGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Create an Empty trip</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className={style.emptyTripInfo}>Creates an Empty trip. After creation, you will be redirected to your trip, where you can customize it all you want.</div><br/>
              <MDBRow className={style.modalInput}>
                  <div className={style.formgroup}>
                      <MDBInput label="Trip name" type="text" id="tripNameInput" className={style.modalInput}/>
                  </div>
              </MDBRow><br/>
              <MDBRow className={style.modalInput}>
                  <div className={style.formgroup}>
                      <MDBInput label="Budget" id="budgetInput" type="number" className={style.modalInput}/>
                  </div>
              </MDBRow><br/>
              <MDBRow className={style.modalInput}>
                  <MDBCol className={style.formgroup}>
                      <h6>Start date</h6>
                      <MDBInput placeholder="Select date" type="date" id="startDateInput" className={style.datepicker}/>
                  </MDBCol>
                  <MDBCol className={style.formgroup}>
                      <h6>End date</h6>
                      <MDBInput placeholder="Select date" type="date" id="endDateInput" className={style.datepicker}/>
                  </MDBCol>
                  <div id="errorEmptyPlan" className={style.errorEmptyPlan}></div>
              </MDBRow><br/>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleShow}>
                Close
              </MDBBtn>
              <MDBBtn onClick={submitTrip}>Create Trip</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <MDBContainer>
        <h2 className='text-center mt-5 mb-3'>Goodies from our services</h2>
        <MDBRow className='gx-0'>
          <MDBCol size='6'>
            <MDBCard>
              <MDBCardImage src='https://getwallpapers.com/wallpaper/full/a/8/6/618432.jpg' />
            </MDBCard>
          </MDBCol>
          <MDBCol size='6' className='d-flex align-items-center'>
            <MDBCard className='border-0'>
              <MDBCardBody>
                <MDBCardText>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos earum libero impedit enim est
                  corrupti fugiat vero ratione maiores explicabo nesciunt porro aspernatur, debitis, veniam, dicta modi
                  expedita exercitationem tenetur fuga vel quos autem nam.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBRow className='gx-0'>
          <MDBCol size='6' className='d-flex align-items-center'>
            <MDBCard className='border-0'>
              <MDBCardBody>
                <MDBCardText>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos earum libero impedit enim est
                  corrupti fugiat vero ratione maiores explicabo nesciunt porro aspernatur, debitis, veniam, dicta modi
                  expedita exercitationem tenetur fuga vel quos autem nam.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol size='6'>
            <MDBCard>
              <MDBCardImage src='https://architecturesideas.com/wp-content/uploads/2017/03/beautiful-photography-of-nature.jpeg' />
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBRow className='gx-0'>
          <MDBCol size='6'>
            <MDBCard>
              <MDBCardImage src='https://www.rxwallpaper.site/wp-content/uploads/1080p-nature-wallpapers-wallpaper-cave-800x800.jpg' />
            </MDBCard>
          </MDBCol>
          <MDBCol size='6' className='d-flex align-items-center'>
            <MDBCard className='border-0'>
              <MDBCardBody>
                <MDBCardText>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos earum libero impedit enim est
                  corrupti fugiat vero ratione maiores explicabo nesciunt porro aspernatur, debitis, veniam, dicta modi
                  expedita exercitationem tenetur fuga vel quos autem nam.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}

export default HomePage;
