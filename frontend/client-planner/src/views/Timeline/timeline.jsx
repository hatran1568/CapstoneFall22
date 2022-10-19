import React, { Component, useState } from "react";
import { withRouter } from "react-router";
import TripDetail from "./tripDetail";
import AddActivityModal from "./AddActivityModal";
import axios from "axios";
// import tripData from "./tripData.json";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBBtn,
  MDBIcon,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";
import { useParams } from "react-router-dom";
import style from "./timeline.module.css";
class Timeline extends Component {
  state = {};
  //set state of component
  constructor(props) {
    super(props);
    this.state = {
      trip: {},
      showAddModal: false,
      showEditModal: false,
      dataLoaded: false,
      detailInEdit: -1,
    };
  }
  //get request to get trip info
  componentDidMount() {
    axios.get(`http://localhost:8080/trip/1`).then((res) => {
      const tripData = res.data;
      this.setState({
        trip: tripData,
        showAddModal: false,
        showEditModal: false,
        dataLoaded: true,
      });
    });
  }
  //order all tripDetails by date and time
  orderTripDetails = () => {
    var newState = this.state;
    var sortedDetails = this.state.trip.listTripDetails
      .sort((a, b) =>
        new Date("1970-01-01T" + a.startTime) >
        new Date("1970-01-01T" + b.startTime)
          ? 1
          : new Date("1970-01-01T" + b.startTime) >
            new Date("1970-01-01T" + a.startTime)
          ? -1
          : 0
      )
      .sort((a, b) =>
        Date.parse(a.date) > Date.parse(b.date)
          ? 1
          : Date.parse(b.date) > Date.parse(a.date)
          ? -1
          : 0
      );
    newState.trip.listTripDetails = sortedDetails;
    this.setState(newState);
  };
  //get all months of a trip
  getAllMonths = (dateArr) => {
    var monthArr = [];
    dateArr.forEach((date) => {
      var month = date.toLocaleString("default", { month: "long" });
      if (!monthArr.includes(month)) monthArr.push(month);
    });
    return monthArr;
  };
  //get all dates in the trip
  getAllDates = (start, end) => {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };
  //get all dates of a month in the trip
  getAllDatesOfMonth = (dateArr, month) => {
    var arr = [];
    dateArr.forEach((dt) => {
      if (dt.toLocaleString("default", { month: "long" }) == month) {
        arr.push(new Date(dt));
      }
    });
    return arr;
  };
  //get all trip details in a day
  getTripDetailsByDate = (date) => {
    var detailsArr = [];
    var dateStr = date.toISOString().split("T")[0];
    this.state.trip.listTripDetails.forEach((detail) => {
      if (dateStr.valueOf() == detail.date.valueOf()) {
        detailsArr.push(detail);
      }
    });
    var sortedArr = detailsArr.sort((a, b) =>
      a.startTime > b.startTime ? 1 : b.startTime > a.startTime ? -1 : 0
    );
    return sortedArr;
  };
  //toggle add modal
  toggleAddModal = () => {
    var newState = this.state;
    newState.showAddModal = !newState.showAddModal;
    this.setState(newState);
  };
  //delete an activirty
  deleteTripDetail = (event, detailId) => {
    if (
      confirm(
        "Do you really want to delete this event from your trip?" + detailId
      )
    ) {
      axios
        .delete(`http://localhost:8080/trip/delete-detail`, {
          data: { id: detailId },
        })
        .then((response) => {
          if (response.status == 200) {
            var newTrip = this.state.trip;
            newTrip.listTripDetails = newTrip.listTripDetails.filter(function (
              detail
            ) {
              return detail.tripDetailsId !== detailId;
            });
            this.setState(
              {
                trip: newTrip,
                showAddModal: false,
                showEditModal: false,
                dataLoaded: true,
              },
              this.render
            );
          }
        });
    }
  };
  //get a tripDetail inside trip in state
  getTripDetailById = (id) => {
    var arr = this.state.trip.listTripDetails.find((element) => {
      return element.tripDetailsId === id;
    });
    if (arr.length > 0) return arr[0];
    return {};
  };
  //put request to edit a detail
  editTripDetail = (event, detail) => {
    var start = detail.startTime.split(":");
    detail.startTime = +start[0] * 60 * 60 + +start[1] * 60;
    var end = detail.endTime.split(":");
    detail.endTime = +end[0] * 60 * 60 + +end[1] * 60;
    axios({
      method: "put",
      url: "http://localhost:8080/trip/put-detail?id=" + detail.tripDetailsId,
      headers: {
        "Content-Type": "application/json",
      },
      data: detail,
    })
      .then((response) => {
        this.updateDetail(detail.tripDetailsId, response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //update an activity in the state
  updateDetail = (oldDetailId, newDetail) => {
    var oldDetail = this.state.trip.listTripDetails.find(
      (el) => el.tripDetailsId == oldDetailId
    );
    var index = -1;
    if (oldDetail) index = this.state.trip.listTripDetails.indexOf(oldDetail);
    var newState = this.state;
    newState.trip.listTripDetails[index] = newDetail;
    this.setState(newState);
  };
  //insert an activity into the trip
  insertTripDetail = (event, input) => {
    var start = input.start_time.split(":");
    var startSeconds = +start[0] * 60 * 60 + +start[1] * 60;
    var end = input.end_time.split(":");
    var endSeconds = +end[0] * 60 * 60 + +end[1] * 60;
    axios
      .post(`http://localhost:8080/trip/add-detail`, {
        date: input.date,
        startTime: startSeconds,
        endTime: endSeconds,
        activityId: input.activity_id,
        tripId: this.state.trip.tripId,
      })
      .then((response) => {
        var newDetail = response.data;
        var newTrip = this.state.trip;
        newTrip.listTripDetails.push(newDetail);
        this.setState(
          {
            trip: newTrip,
            showAddModal: false,
            showEditModal: false,
            dataLoaded: true,
          },
          this.render
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //gets the id of the next trip detail in the list, to get the distance between the 2 later
  getNextTripDetail = (list, detail) => {
    var index = list.indexOf(detail);
    var nextItem;
    if (index >= 0 && index < list.length - 1) nextItem = list[index + 1];
    if (nextItem) return nextItem.masterActivity.activityId;
    return -1;
  };
  //gets the id of the next trip detail in the list, to get the distance between the 2 later
  isConflicting = (list, detail) => {
    var index = list.indexOf(detail);
    if (index >= 1) {
      var preDetail = list[index - 1];
      if (detail.startTime < preDetail.endTime) return true;
    }
    if (index >= 0 && index < list.length - 1) {
      var nextDetail = list[index + 1];
      if (detail.endTime > nextDetail.startTime) return true;
    }
    return false;
  };
  render() {
    if (!this.state.dataLoaded)
      return (
        <div>
          <h1> Pleses wait some time.... </h1>{" "}
        </div>
      );
    var allDates = this.getAllDates(
      this.state.trip.startDate,
      this.state.trip.endDate
    );
    var allMonths = this.getAllMonths(allDates);
    return (
      <div>
        <MDBNavbar light bgColor="light">
          <MDBContainer fluid>
            <MDBNavbarBrand href="#">
              <img
                src="https://mdbootstrap.com/img/logo/mdb-transaprent-noshadows.webp"
                height="30"
                alt=""
                loading="lazy"
              />
              {this.state.trip.name}
            </MDBNavbarBrand>
            <form className="d-flex input-group w-auto">
              <input
                type="search"
                className="form-control"
                placeholder="Type query"
                aria-label="Search"
              />
              <MDBBtn color="primary">Search</MDBBtn>
            </form>
          </MDBContainer>
        </MDBNavbar>
        <MDBNavbar sticky light bgColor="light" id="sticky-nav-first">
          <MDBContainer
            fluid
            className="justify-content-center sticky-nav-second"
          >
            <MDBTabs className="mb-3">
              <MDBTabsItem>
                <MDBTabsLink active>
                  <MDBIcon fas icon="list-ul" className="me-2" /> Timeline
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink>
                  <MDBIcon fas icon="calendar-day" className="me-2" /> Timetable
                </MDBTabsLink>
              </MDBTabsItem>
              <MDBTabsItem>
                <MDBTabsLink>
                  <MDBIcon fas icon="map" className="me-2" /> Map
                </MDBTabsLink>
              </MDBTabsItem>
            </MDBTabs>
          </MDBContainer>
        </MDBNavbar>
        <div className="container ">
          <div className="timeline-container row ">
            <div className="col-2 days-col">
              <div className={style.daysBox}>
                {allMonths.map((month) => (
                  <div key={month}>
                    <div>{month}</div>
                    {this.getAllDatesOfMonth(allDates, month).map((date) => (
                      <a
                        href={"#" + date.toISOString().split("T")[0]}
                        key={date}
                      >
                        <div>{date.getDate()}</div>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-8">
              {allDates.map((date) => (
                <a
                  name={date.toISOString().split("T")[0]}
                  key={date.toISOString().split("T")[0]}
                >
                  <div>
                    <div className={style.detailsGroupDate}>
                      {date.toISOString().split("T")[0]}
                    </div>
                    <ul className={style.timeline}>
                      {this.getTripDetailsByDate(date).map((tripDetail) => (
                        <TripDetail
                          key={tripDetail.tripDetailsId}
                          tripDetail={tripDetail}
                          deleteEvent={(event, detailId) =>
                            this.deleteTripDetail(event, detailId)
                          }
                          editEvent={(event, detail) =>
                            this.editTripDetail(event, detail)
                          }
                          nextActivityId={this.getNextTripDetail(
                            this.getTripDetailsByDate(date),
                            tripDetail
                          )}
                          allDates={allDates}
                          isConflicting={this.isConflicting(
                            this.getTripDetailsByDate(date),
                            tripDetail
                          )}
                        ></TripDetail>
                      ))}
                    </ul>
                  </div>
                </a>
              ))}
            </div>
            <div className="col-2"></div>
          </div>
          <div
            className={`form-group`}
            style={{ position: "fixed", bottom: 0, right: "20px" }}
          >
            <button
              type="button"
              className="btn btn-primary btn-md"
              id={style.btnAdd}
              variant="primary"
              onClick={this.toggleAddModal}
            >
              +
            </button>
          </div>
        </div>
        <AddActivityModal
          show={this.state.showAddModal}
          onHide={this.toggleAddModal}
          allDates={allDates}
          activityAdded={(event, input) => this.insertTripDetail(event, input)}
        />
      </div>
    );
  }
}

export default Timeline;