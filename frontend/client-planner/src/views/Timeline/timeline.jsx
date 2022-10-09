import React, { Component } from "react";
import TripDetail from "./tripDetail";
import "./timeline.css";
import tripData from "./tripData.json";
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
class Timeline extends Component {
  state = tripData;
  constructor() {
    super();
  }
  componentDidMount() {
    var newState = this.state;
    var sortedDetails = this.state.tripDetails
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
    newState.tripDetails = sortedDetails;
    this.setState(newState);
  }
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
    this.state.tripDetails.forEach((detail) => {
      if (dateStr.valueOf() == detail.date.valueOf()) {
        detailsArr.push(detail);
      }
    });
    return detailsArr;
  };

  render() {
    var allDates = this.getAllDates(this.state.startDate, this.state.endDate);
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
              {this.state.name}
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
                      <a href={"#" + date.toISOString().split("T")[0]}>
                        <div key={date}>{date.getDate()}</div>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-8">
              {allDates.map((date) => (
                <a name={date.toISOString().split("T")[0]}>
                  <div key={date.toISOString().split("T")[0]}>
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
        </div>
      </div>
    );
  }
}

export default Timeline;
