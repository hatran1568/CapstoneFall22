import React, { useEffect } from "react";
import axios from "../../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DestinationSearchBar from "../../components/DestinationSearchBar/DestinationSearchBar";
import RecentTrips from "./RecentTrips";
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
  MDBSpinner,
  MDBIcon,
} from "mdb-react-ui-kit";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import style from "./HomePage.module.css";
import TripInfoCardHomepage from "../../components/Trips/TripInfoCardHomepage";

function HomePage() {
  const navigate = useNavigate();
  const [basicModal, setBasicModal] = useState(false);
  let loggedInUser = localStorage.getItem("id");
  if (loggedInUser == null) loggedInUser = -1;
  const [centredModal, setCentredModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showShow, setShowShow] = useState(false);
  const [tripCount, setTripCount] = useState(0);
  const [trips, setTrips] = useState();
  const toggleShowMore = () => setShowShow(!showShow);
  const [request, setRequest] = useState();
  const [port, setPort] = useState();
  const [isFirst, setIsFirst] = useState(true);
  var stompClient = null;
  const connect = function (userId, port) {
    if ((userId, port)) {
      var socket = new SockJS("http://localhost:" + port + "/ws");
      stompClient = over(socket);
      stompClient.connect({}, onConnected, onError);
    }
  };
  const onError = (err) => {};
  useEffect(() => {
    checkGenerating();
  }, []);
  const onConnected = () => {
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
  useEffect(() => {
    const interval = setInterval(() => {
      checkGenerating();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const toggleShow = () => {
    setBasicModal(!basicModal);
    document.getElementById("budgetInput").value = "";
    document.getElementById("tripNameInput").value = "";
    document.getElementById("startDateInput").value = null;
    document.getElementById("endDateInput").value = null;
    document.getElementById("errorEmptyPlan1").innerHTML = "";
  };

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
      return;
    }
    if (!isGenerating) {
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
            setTrips(response.data);
          });
      }
    }

    getExistingTrips();
  }, [isGenerating]);
  const submitTrip = (event) => {
    if (
      document.getElementById("budgetInput").value == "" ||
      document.getElementById("tripNameInput").value == "" ||
      !document.getElementById("startDateInput").value ||
      !document.getElementById("endDateInput").value
    ) {
      document.getElementById("errorEmptyPlan1").innerHTML =
        "Please enter all fields.";
    } else if (
      document.getElementById("startDateInput").value >
      document.getElementById("endDateInput").value
    )
      document.getElementById("errorEmptyPlan1").innerHTML =
        "Please enter valid dates.";
    else {
      var userId = 2;
      if (localStorage.getItem("id") != null)
        userId = localStorage.getItem("id");
      axios({
        method: "post",
        url: "http://localhost:8080/trip/createTrip",
        data: {
          userId: userId,
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
    }
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
      stompClient = null;
    }
  }, [progress != 100]);
  const cancelGenerating = () => {
    axios({
      method: "post",
      url: "http://localhost:8080/trip/cancel/" + localStorage.getItem("id"),

      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(function (response) {
        setIsGenerating(false);
        toast.success("🦄 Canceled!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch(function (err) {
        toast.error("🦄Cancel Failed! Try to reload the page!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };
  const checkGenerating = () => {
    axios({
      method: "get",
      url:
        "http://localhost:8080/trip/checkGenerating/" +
        localStorage.getItem("id"),

      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then(function (response) {
      if (response.data == true) {
        setIsGenerating(true);
      } else {
        setIsGenerating(false);
      }
      //connect(id,response.data);
    });
  };
  const setSelectedPOI = (item) => {
    document.getElementById("destination").value = item.id;
  };
  const submitGenerateTrip = (event) => {
    const startDate = new Date(
      document.getElementById("startDateGenerateInput").value
    );
    const endDate = new Date(
      document.getElementById("endDateGenerateInput").value
    );
    if (
      document.getElementById("budgetGenerateInput").value == "" ||
      document.getElementById("destination").value == "-1" ||
      !document.getElementById("startDateGenerateInput").value ||
      !document.getElementById("endDateGenerateInput").value
    ) {
      document.getElementById("errorEmptyPlan").innerHTML =
        "Please enter all fields.";
    } else {
      if (endDate < startDate) {
        document.getElementById("errorEmptyPlan").innerHTML =
          "Please enter valid date.";
        return;
      }
      let preferences = [];
      for (let i = 1; i <= 9; i++) {
        let value = document.getElementById(i);
        if (value.checked) {
          preferences.push(i);
        }
      }
      axios({
        method: "post",
        url: "http://localhost:8080/trip/generate",
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
        setRequest(response.data.id);
        setPort(response.data.port);
        //connect(id,response.data);
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
              <div className="px-3" id={style["splash-text"]}>
                <h3 className="text-dark text-center">
                  Lên kế hoạch cho chuyến đi của bạn
                </h3>
                <p
                  className="text-muted text-center"
                  style={{ fontSize: "1rem" }}
                >
                  Sử dụng dịch vụ gợi ý của chúng tôi, hoặc tự tạo kế hoạch của
                  riêng bạn
                </p>
                <MDBBtnGroup className={style.btn}>
                  {isGenerating ? (
                    <MDBBtn color="info" onClick={toggleShowGenerate}>
                      Chuyến đi của bạn sắp hoàn thành!
                    </MDBBtn>
                  ) : (
                    <MDBBtn color="info" onClick={toggleShowGenerate}>
                      Gợi ý chuyến đi
                    </MDBBtn>
                  )}

                  <MDBModal
                    tabIndex="-1"
                    show={centredModal}
                    setShow={setCentredModal}
                  >
                    <MDBModalDialog size="lg" centered>
                      <MDBModalContent>
                        <MDBModalHeader>
                          <MDBModalTitle>Gợi ý chuyến đi</MDBModalTitle>
                          <MDBBtn
                            className="btn-close"
                            color="none"
                            onClick={toggleShowGenerate}
                          ></MDBBtn>
                        </MDBModalHeader>

                        {isGenerating ? (
                          <MDBModalBody>
                            <div className="d-flex justify-content-center">
                              <span> Đang tìm kiếm chuyến đi tốt nhất.</span>
                              <MDBSpinner role="status">
                                <span className="visually-hidden"></span>
                              </MDBSpinner>
                            </div>
                          </MDBModalBody>
                        ) : (
                          <MDBModalBody>
                            <MDBRow className={""}>
                              <div className={style.formgroup}>
                                <div className="form-outline"></div>
                                <input
                                  type="text"
                                  id="destination"
                                  value="-1"
                                  hidden
                                ></input>
                                <DestinationSearchBar
                                  POISelected={setSelectedPOI}
                                ></DestinationSearchBar>
                              </div>
                            </MDBRow>
                            <br />
                            <MDBRow className={style.modalInput}>
                              <div className={style.formgroup}>
                                <MDBInput
                                  label="Ngân sách"
                                  id="budgetGenerateInput"
                                  type="number"
                                  className={""}
                                />
                              </div>
                            </MDBRow>
                            <br />
                            <MDBRow className={style.modalInput}>
                              <MDBCol className={style.formgroup}>
                                <h6>Ngày bắt đầu</h6>
                                <MDBInput
                                  placeholder="Select date"
                                  type="date"
                                  id="startDateGenerateInput"
                                  className={style.datepicker}
                                />
                              </MDBCol>
                              <MDBCol className={style.formgroup}>
                                <h6>Ngày kết thúc</h6>
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
                                  Bạn muốn làm những gì trong chuyến đi{" "}
                                  {!showShow ? (
                                    <MDBIcon fas icon="caret-down" />
                                  ) : (
                                    <MDBIcon fas icon="caret-up" />
                                  )}
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
                                <MDBCol size="4">
                                  <MDBCheckbox
                                    className={style.formInput}
                                    name="ArtAndCulture"
                                    id="1"
                                    value="1"
                                    label="Văn hóa, nghệ thuật"
                                  />
                                  <MDBCheckbox
                                    className={style.formInput}
                                    name="Religion"
                                    id="3"
                                    value="3"
                                    label="Tôn giáo"
                                  />
                                  <MDBCheckbox
                                    className={style.formInput}
                                    name="Outdoors"
                                    id="2"
                                    value="2"
                                    label="Hoạt động ngoài trời"
                                  />
                                </MDBCol>

                                <br />
                                <MDBCol size="4">
                                  <MDBCheckbox
                                    className={style.formInput}
                                    name="Historic&sights"
                                    id="4"
                                    value="4"
                                    label="Lịch sử"
                                  />
                                  <MDBCheckbox
                                    className={style.formInput}
                                    name="Museums"
                                    id="5"
                                    value="5"
                                    label="Bảo tàng"
                                  />
                                  <MDBCheckbox
                                    className={style.formInput}
                                    name="Beaches"
                                    id="8"
                                    value="8"
                                    label="Bãi biển"
                                  />
                                </MDBCol>
                                <MDBCol size="4">
                                  <MDBCheckbox
                                    className={style.formInput}
                                    name="Spas&Wellness"
                                    id="6"
                                    value="6"
                                    label="Spa & Sức khỏe"
                                  />
                                  <MDBCheckbox
                                    className={style.formInput}
                                    name="Shopping"
                                    id="7"
                                    value="7"
                                    label="Mua sắm"
                                  />
                                  <MDBCheckbox
                                    className={style.formInput}
                                    name="Nightlife"
                                    id="9"
                                    value="9"
                                    label="Hoạt động đêm"
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
                          {!isGenerating ? (
                            <MDBBtn onClick={submitGenerateTrip}>
                              Gợi ý chuyến đi
                            </MDBBtn>
                          ) : (
                            <MDBBtn onClick={cancelGenerating}>
                              Dừng gợi ý
                            </MDBBtn>
                          )}
                        </MDBModalFooter>
                      </MDBModalContent>
                    </MDBModalDialog>
                  </MDBModal>
                  {/* <MDBBtn color='info'>Create&nbsp;trip</MDBBtn> */}
                  <MDBBtn color="info" onClick={toggleShow}>
                    Tạo chuyến đi
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
              <MDBModalTitle>Tạo chuyến đi mới</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className={style.emptyTripInfo}>
                Tạo ra một chuyến đi trống. Sao khi khởi tạo, bạn sẽ được chuyển
                tới chuyến đi và có thể tự tùy chỉnh theo ý muốn.
              </div>
              <br />
              <MDBRow className={style.modalInput}>
                <div className={style.formgroup}>
                  <MDBInput
                    label="Tên chuyến đi"
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
                    label="Ngân sách"
                    id="budgetInput"
                    type="number"
                    className={style.modalInput}
                  />
                </div>
              </MDBRow>
              <br />
              <MDBRow className={style.modalInput}>
                <MDBCol className={style.formgroup}>
                  <h6>Ngày đi</h6>
                  <MDBInput
                    placeholder="Select date"
                    type="date"
                    id="startDateInput"
                    className={style.datepicker}
                  />
                </MDBCol>
                <MDBCol className={style.formgroup}>
                  <h6>Ngày về</h6>
                  <MDBInput
                    placeholder="Select date"
                    type="date"
                    id="endDateInput"
                    className={style.datepicker}
                  />
                </MDBCol>
                <div
                  id="errorEmptyPlan1"
                  className={style.errorEmptyPlan}
                ></div>
              </MDBRow>
              <br />
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleShow}>
                Đóng
              </MDBBtn>
              <MDBBtn onClick={submitTrip}>Tạo chuyến đi</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {tripCount != 0 && trips ? (
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
      <MDBContainer
        className="mt-5 d-flex justify-content-center"
        style={{ width: "70%" }}
      >
        <RecentTrips />
      </MDBContainer>
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
