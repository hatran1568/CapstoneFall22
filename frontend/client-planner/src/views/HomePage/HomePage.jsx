import React, { useEffect } from "react";
import axios from "../../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  MDBProgress,
  MDBProgressBar,
  MDBCollapse,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import style from "./HomePage.module.css";
import TripInfoCardHomepage from "../../components/Trips/TripInfoCardHomepage";

function HomePage() {
  const navigate = useNavigate();
  const [basicModal, setBasicModal] = useState(false);
  let loggedInUser = localStorage.getItem("id");
  if (loggedInUser == null)
    loggedInUser = -1;
  const [centredModal, setCentredModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showShow, setShowShow] = useState(false);
  const [tripCount, setTripCount] = useState(0);
  const [trips, setTrips] = useState();
  const toggleShowMore = () => setShowShow(!showShow);

  var stompClient = null;
  const connect = function (userId) {
    if (userId) {
      var socket = new SockJS("http://localhost:8081/ws");
      stompClient = over(socket);
      console.log("connected");
      stompClient.connect({}, onConnected, onError);
    }
  };
  const onError = (err) => {
    console.log(err);
  };
  useEffect(() => {
    connect(localStorage.getItem("id"));
  }, []);
  const onConnected = () => {
    console.log("onConnected");
    // Subscribe to the Public Topic
    // stompClient.subscribe("/chatroom", onMessageReceived);
    stompClient.subscribe(
      "/user/" + localStorage.getItem("id") + "/chatroom",
      onPrivateMessage
    );
  };

  useEffect(() => {
    async function getExistingTrips() {
      if (localStorage.getItem("token")) {
        await axios
          .get(
            "http://localhost:8080/trip/get-total-trip/" +
              localStorage.getItem("id"),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log(response.data);
            setTripCount(response.data);
          });
        await axios
          .get(
            "http://localhost:8080/trip/get-trip-3/" +
              localStorage.getItem("id"),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log("COunt" + response.data);

            setTrips(response.data);
          });
      }
    }

    getExistingTrips();
  }, []);

  const onMessageReceived = (payload) => {
    console.log(payload.body);
  };
  const onPrivateMessage = (payload) => {
    if (isNumeric(payload.body)) {
      console.log(payload.body);
      setProgress(payload.body);
    }
  };
  function isNumeric(value) {
    return /^-?\d+$/.test(value);
  }
  const toggleShowGenerate = () => {
    setCentredModal(!centredModal);
  };
  const toggleOffGenerate = () => {
    setCentredModal(false);
  };
  const toggleShow = () => {
    setBasicModal(!basicModal);
    document.getElementById("budgetInput").value = "";
    document.getElementById("tripNameInput").value = "";
    document.getElementById("startDateInput").value = null;
    document.getElementById("endDateInput").value = null;
    document.getElementById("errorEmptyPlan").innerHTML = "";
  };
  const submitTrip = (event) => {
    if (
      document.getElementById("budgetInput").value == "" ||
      document.getElementById("tripNameInput").value == "" ||
      !document.getElementById("startDateInput").value ||
      !document.getElementById("endDateInput").value
    ) {
      document.getElementById("errorEmptyPlan").innerHTML =
        "Please enter all fields.";
    } else
      axios({
        method: "post",
        url: "http://localhost:8080/trip/createTrip",
        data: {
          userId: localStorage.getItem("id"),
          budget: document.getElementById("budgetInput").value,
          name: document.getElementById("tripNameInput").value,
          startDate: document.getElementById("startDateInput").value,
          endDate: document.getElementById("endDateInput").value,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        navigate("../Timeline/" + response.data);
        window.location.reload(false);
      });
  };
  useEffect(() => {
    if (progress != 0) {
      toggleOffGenerate();
      setIsGenerating(false);
      setProgress(0);

      toast(" Your trip is ready!!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "light",
      });
    }
  }, [progress != 100]);
  const submitGenerateTrip = (event) => {
    if (
      document.getElementById("budgetGenerateInput").value == "" ||
      document.getElementById("tripNameGenerateInput").value == "" ||
      !document.getElementById("startDateGenerateInput").value ||
      !document.getElementById("endDateGenerateInput").value
    ) {
      document.getElementById("errorEmptyPlan").innerHTML =
        "Please enter all fields.";
    } else {
      let preferences = [];
      for (let i = 1; i <= 9; i++) {
        let value = document.getElementById(i);
        console.log(value);
        if (value.checked) {
          preferences.push(i);
        }
      }
      console.log(preferences);
      axios({
        method: "post",
        url: "http://localhost:8081/trip/generate",
        data: {
          userId: localStorage.getItem("id"),
          budget: document.getElementById("budgetGenerateInput").value,
          destinationId: "1",
          startDate: document.getElementById("startDateGenerateInput").value,
          endDate: document.getElementById("endDateGenerateInput").value,
          startTime: "30600",
          endTime: "75600",
          userPreference: preferences,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        setIsGenerating(true);
      });
    }
  };
  return (
    <>
      <div className="bg-image">
        <img
          src="https://myhugesavings.com/wp-content/uploads/revslider/travelslider/travel-page-bg.jpg"
          className={style.img}
          height="auto"
          width="100%"
          alt="travel"
        />
        <div className="mask" style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}>
          <div className={style.splashContainer}>
            <div className={style.splash}>
              <div className="px-5" id={style["splash-text"]}>
                <h2 className="text-dark text-center">Make planning great!</h2>
                <p className="text-muted text-center">
                  Ease your head on decisions.
                </p>
                <MDBBtnGroup className={style.btn}>
                  <MDBBtn color="info" onClick={toggleShowGenerate}>
                    Generate Trip
                  </MDBBtn>

                  <MDBModal
                    tabIndex="-1"
                    show={centredModal}
                    setShow={setCentredModal}
                  >
                    <MDBModalDialog size="lg" centered>
                      <MDBModalContent>
                        <MDBModalHeader>
                          <MDBModalTitle>Modal title</MDBModalTitle>
                          <MDBBtn
                            className="btn-close"
                            color="none"
                            onClick={toggleShowGenerate}
                          ></MDBBtn>
                        </MDBModalHeader>

                        {isGenerating ? (
                          <MDBModalBody>
                            <MDBProgress height="20">
                              <MDBProgressBar
                                width={progress}
                                valuemin={0}
                                valuemax={100}
                              >
                                {progress + "%"}
                              </MDBProgressBar>
                            </MDBProgress>
                          </MDBModalBody>
                        ) : (
                          <MDBModalBody>
                            <MDBRow className={style.modalInput}>
                              <div className={style.formgroup}>
                                <MDBInput
                                  label="Trip name"
                                  type="text"
                                  id="tripNameGenerateInput"
                                  className={style.modalInput}
                                />
                              </div>
                            </MDBRow>
                            <br />
                            <MDBRow className={style.modalInput}>
                              <div className={style.formgroup}>
                                <MDBInput
                                  label="Budget"
                                  id="budgetGenerateInput"
                                  type="number"
                                  className={style.modalInput}
                                />
                              </div>
                            </MDBRow>
                            <br />
                            <MDBRow className={style.modalInput}>
                              <MDBCol className={style.formgroup}>
                                <h6>Start date</h6>
                                <MDBInput
                                  placeholder="Select date"
                                  type="date"
                                  id="startDateGenerateInput"
                                  className={style.datepicker}
                                />
                              </MDBCol>
                              <MDBCol className={style.formgroup}>
                                <h6>End date</h6>
                                <MDBInput
                                  placeholder="Select date"
                                  type="date"
                                  id="endDateGenerateInput"
                                  className={style.datepicker}
                                />
                              </MDBCol>
                              <div
                                id="errorEmptyPlan"
                                className={style.errorEmptyPlan}
                              ></div>
                            </MDBRow>
                            <br></br>
                            <MDBRow className={style.modalGenerateInput}>
                              <MDBCol>
                                <a onClick={toggleShowMore}>
                                  Activities Preferences
                                </a>
                              </MDBCol>

                              <MDBRow
                                around
                                className={
                                  style.optional +
                                  " " +
                                  (showShow && style.show)
                                }
                              >
                                <MDBCol size="3">
                                  <MDBCheckbox
                                    name="ArtAndCulture"
                                    id="1"
                                    value="1"
                                    label="Art & Culture"
                                  />
                                  <MDBCheckbox
                                    name="Religion"
                                    id="3"
                                    value="3"
                                    label="Religion"
                                  />
                                  <MDBCheckbox
                                    name="Outdoors"
                                    id="2"
                                    value="2"
                                    label="Outdoors"
                                  />
                                </MDBCol>

                                <br />
                                <MDBCol size="3">
                                  <MDBCheckbox
                                    name="Historic&sights"
                                    id="4"
                                    value="4"
                                    label="Historic sights"
                                  />
                                  <MDBCheckbox
                                    name="Museums"
                                    id="5"
                                    value="5"
                                    label="Museums"
                                  />
                                  <MDBCheckbox
                                    name="Beaches"
                                    id="8"
                                    value="8"
                                    label="Beaches"
                                  />
                                </MDBCol>
                                <MDBCol size="3">
                                  <MDBCheckbox
                                    name="Spas&Wellness"
                                    id="6"
                                    value="6"
                                    label="Spas & Wellness"
                                  />
                                  <MDBCheckbox
                                    name="Shopping"
                                    id="7"
                                    value="7"
                                    label="Shopping"
                                  />
                                  <MDBCheckbox
                                    name="Nightlife"
                                    id="9"
                                    value="9"
                                    label="Nightlife"
                                  />
                                </MDBCol>
                              </MDBRow>
                            </MDBRow>
                          </MDBModalBody>
                        )}

                        <MDBModalFooter>
                          <MDBBtn
                            color="secondary"
                            onClick={toggleShowGenerate}
                          >
                            Close
                          </MDBBtn>
                          {!isGenerating && (
                            <MDBBtn onClick={submitGenerateTrip}>
                              Save changes
                            </MDBBtn>
                          )}
                        </MDBModalFooter>
                      </MDBModalContent>
                    </MDBModalDialog>
                  </MDBModal>
                  {/* <MDBBtn color='info'>Create&nbsp;trip</MDBBtn> */}
                  <MDBBtn color="info" onClick={toggleShow}>
                    Create Trip
                  </MDBBtn>
                </MDBBtnGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Create an Empty trip</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className={style.emptyTripInfo}>
                Creates an Empty trip. After creation, you will be redirected to
                your trip, where you can customize it all you want.
              </div>
              <br />
              <MDBRow className={style.modalInput}>
                <div className={style.formgroup}>
                  <MDBInput
                    label="Trip name"
                    type="text"
                    id="tripNameInput"
                    className={style.modalInput}
                  />
                </div>
              </MDBRow>
              <br />
              <MDBRow className={style.modalInput}>
                <div className={style.formgroup}>
                  <MDBInput
                    label="Budget"
                    id="budgetInput"
                    type="number"
                    className={style.modalInput}
                  />
                </div>
              </MDBRow>
              <br />
              <MDBRow className={style.modalInput}>
                <MDBCol className={style.formgroup}>
                  <h6>Start date</h6>
                  <MDBInput
                    placeholder="Select date"
                    type="date"
                    id="startDateInput"
                    className={style.datepicker}
                  />
                </MDBCol>
                <MDBCol className={style.formgroup}>
                  <h6>End date</h6>
                  <MDBInput
                    placeholder="Select date"
                    type="date"
                    id="endDateInput"
                    className={style.datepicker}
                  />
                </MDBCol>
                <div id="errorEmptyPlan" className={style.errorEmptyPlan}></div>
              </MDBRow>
              <br />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleShow}>
                Close
              </MDBBtn>
              <MDBBtn onClick={submitTrip}>Create Trip</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {trips ? (
        <MDBContainer className="mt-5" style={{ width: "70%" }}>
          <h3 className="mx-5">My trips ({tripCount})</h3>

          <MDBContainer className="d-flex flex-row item-align-center">
            {trips.map((trip) => (
              <TripInfoCardHomepage
                trip={trip}
                key={trip.tripId}
              ></TripInfoCardHomepage>
            ))}
          </MDBContainer>
          <div className="d-flex justify-content-center">
            <MDBBtn
              onClick={() => {
                window.location.href = "http://localhost:3000/profile";
              }}
              style={{
                backgroundColor: "black",
                border: "none",
                borderRadius: "20px",
                padding: "10px 20px",
              }}
            >
              See all trips
            </MDBBtn>
          </div>
        </MDBContainer>
      ) : null}

      <MDBContainer>
        <h2 className="text-center mt-5 mb-3">Goodies from our services</h2>
        <MDBRow className="gx-0">
          <MDBCol size="6">
            <MDBCard>
              <MDBCardImage src="https://getwallpapers.com/wallpaper/full/a/8/6/618432.jpg" />
            </MDBCard>
          </MDBCol>
          <MDBCol size="6" className="d-flex align-items-center">
            <MDBCard className="border-0">
              <MDBCardBody>
                <MDBCardText>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Dignissimos earum libero impedit enim est corrupti fugiat vero
                  ratione maiores explicabo nesciunt porro aspernatur, debitis,
                  veniam, dicta modi expedita exercitationem tenetur fuga vel
                  quos autem nam.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBRow className="gx-0">
          <MDBCol size="6" className="d-flex align-items-center">
            <MDBCard className="border-0">
              <MDBCardBody>
                <MDBCardText>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Dignissimos earum libero impedit enim est corrupti fugiat vero
                  ratione maiores explicabo nesciunt porro aspernatur, debitis,
                  veniam, dicta modi expedita exercitationem tenetur fuga vel
                  quos autem nam.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol size="6">
            <MDBCard>
              <MDBCardImage src="https://architecturesideas.com/wp-content/uploads/2017/03/beautiful-photography-of-nature.jpeg" />
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <MDBRow className="gx-0">
          <MDBCol size="6">
            <MDBCard>
              <MDBCardImage src="https://www.rxwallpaper.site/wp-content/uploads/1080p-nature-wallpapers-wallpaper-cave-800x800.jpg" />
            </MDBCard>
          </MDBCol>
          <MDBCol size="6" className="d-flex align-items-center">
            <MDBCard className="border-0">
              <MDBCardBody>
                <MDBCardText>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Dignissimos earum libero impedit enim est corrupti fugiat vero
                  ratione maiores explicabo nesciunt porro aspernatur, debitis,
                  veniam, dicta modi expedita exercitationem tenetur fuga vel
                  quos autem nam.
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default HomePage;
