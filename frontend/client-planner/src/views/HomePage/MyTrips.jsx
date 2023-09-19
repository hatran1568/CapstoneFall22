import React, { useState, useEffect } from "react";
import { json, useNavigate } from "react-router-dom";
import style from "./newhomepage.module.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../api/axios";
import TripInfoCardHomepage from "../../components/Trips/TripInfoCardHomepage";
import { MDBBtn, MDBContainer } from "mdb-react-ui-kit";
function MyTrips() {
  const [tripCount, setTripCount] = useState(0);
  const [trips, setTrips] = useState();
  async function getGuestId() {
    if (!localStorage.getItem("id")) {
      await axios
        .get("http://localhost:8080/user/api/user/get-guest-id", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          localStorage.setItem("id", response?.data);
          localStorage.setItem("role", "Guest");
          localStorage.setItem("trips", []);
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
          },
        )
        .then((response) => {
          setTripCount(response.data);
        });
      await axios
        .get(
          "http://localhost:8080/trip/get-trip-3/" + localStorage.getItem("id"),
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        )
        .then((response) => {
          setTrips(response.data);
        });
    } else {
      let trips = localStorage.getItem("trips");
      if (trips) {
        trips = JSON.parse(trips);
        setTripCount(trips.length);
        await axios({
          method: "post",
          url: "http://localhost:8080/trip/get-trip-3-guest",
          data: trips,
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            setTrips(response.data);
          })
          .catch((error) => console.log(error));
      }
    }
  }
  useEffect(() => {
    getGuestId();
    getExistingTrips();
  }, []);
  const onTripDeleted = (event, tripId) => {
    deleteFromStorage(tripId);
    getExistingTrips();
  };
  const deleteFromStorage = (tripId) => {
    let trips = localStorage.getItem("trips");
    if (trips) {
      trips = JSON.parse(trips);
      const index = trips.indexOf(tripId);
      if (index > -1) {
        trips.splice(index, 1);
      }
      localStorage.setItem("trips", JSON.stringify(trips));
      setTripCount(trips.length);
    }
  };
  return (
    <>
      {tripCount != 0 && trips ? (
        <div className="container">
          <section
            className={`section ${style.section} ${style.myTripsSection}`}
          >
            <div className="container">
              <h3 className="mb-3">Chuyến đi của bạn ({tripCount})</h3>
              <div className="row">
                {trips.map((trip) => (
                  <div
                    className={`col-lg-4 col-md-6 col-sm-6 col-12 item-align-center`}
                    key={trip.tripId}
                  >
                    <TripInfoCardHomepage
                      trip={trip}
                      key={trip.tripId}
                      onDeleted={(event, tripId) => {
                        onTripDeleted(event, tripId);
                      }}
                    ></TripInfoCardHomepage>
                  </div>
                ))}
              </div>
              <div className="mt-4 d-flex justify-content-center">
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
                  Xem tất cả chuyến đi
                </MDBBtn>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="mb-7"></div>
      )}
    </>
  );
}
export default MyTrips;
