import React, { Component, useState } from "react";
import { withRouter } from "react-router";
import TripDetail from "./tripDetail";
import AddActivityModal from "./AddActivityModal";
import "./timeline.css";
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
class Timeline extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      trip: {},
      showAddModal: false,
      showEditModal: false,
      dataLoaded: false,
    };
  }
  componentDidMount() {
    axios.get(`http://localhost:8080/trip/1`).then((res) => {
      const tripData = res.data;
      console.log("data: " + res.data);
      this.setState({
        trip: tripData,
        showAddModal: false,
        showEditModal: false,
        dataLoaded: true,
      });
    });
  }
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
  getAllMonths = (dateArr) => {
    var monthArr = [];
    dateArr.forEach((date) => {
      var month = date.toLocaleString("default", { month: "long" });
      if (!monthArr.includes(month)) monthArr.push(month);
    });
    return monthArr;
  };
  getAllDates = (start, end) => {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    console.log(arr);
    return arr;
  };
  getAllDatesOfMonth = (dateArr, month) => {
    var arr = [];
    dateArr.forEach((dt) => {
      if (dt.toLocaleString("default", { month: "long" }) == month) {
        arr.push(new Date(dt));
      }
    });
    return arr;
  };
  getTripDetailsByDate = (date) => {
    var detailsArr = [];
    var dateStr = date.toISOString().split("T")[0];
    console.log("date: ", dateStr);
    this.state.trip.listTripDetails.forEach((detail) => {
      if (dateStr.valueOf() == detail.date.valueOf()) {
        detailsArr.push(detail);
      }
    });
    return detailsArr;
  };
  toggleAddModal = () => {
    var newState = this.state;
    newState.showAddModal = !newState.showAddModal;
    this.setState(newState);
  };
  insertTripDetail = () => {};

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
              <div className="days-box">
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
                    <div className="details-group-date">
                      {date.toISOString().split("T")[0]}
                    </div>
                    <ul className="timeline">
                      {this.getTripDetailsByDate(date).map((tripDetail) => (
                        <TripDetail
                          key={tripDetail.id}
                          tripDetail={tripDetail}
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
            className="form-group add-btn"
            style={{ position: "fixed", bottom: 0, right: "20px" }}
          >
            <button
              type="button"
              className="btn btn-primary btn-md"
              id="btnAdd"
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
          onSubmit={this.insertTripDetail}
        />
      </div>
    );
  }
}

export default Timeline;
