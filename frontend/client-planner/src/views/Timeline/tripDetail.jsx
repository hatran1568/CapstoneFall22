import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { faCalendarDays, faCar } from "@fortawesome/free-solid-svg-icons";
import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
} from "mdb-react-ui-kit";

class TripDetail extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = props.tripDetail;
  }
  getTimeFromSecs = (seconds) => {
    var date = new Date(0);
    date.setSeconds(seconds); // specify value for SECONDS here
    var timeString = date.toISOString().substring(11, 19);
    return timeString;
  };
  render() {
    var moment = require("moment"); // require
    return (
      <React.Fragment>
        <li className="timeline-item card">
          {/* <MDBBtn className="btn-close" color="none"></MDBBtn> */}
          <div className="card-body row">
            <div className="col-2">
              <p className="text-muted card-text">
                {moment(
                  this.getTimeFromSecs(this.state.startTime),
                  "HH:mm:ss"
                ).format("hh:mm a")}
                <br />
                {moment(
                  this.getTimeFromSecs(this.state.endTime),
                  "HH:mm:ss"
                ).format("hh:mm a")}
              </p>
            </div>
            <div className="col-4">
              <img
                src={
                  this.state.masterActivity.listImages[0]
                    ? this.state.masterActivity.listImages[0].url
                    : "https://picsum.photos/seed/picsum/300/200"
                }
                className="activity-img"
              ></img>
            </div>
            <div className="col-6">
              <MDBDropdown animation={false} className="btn-more">
                <MDBDropdownToggle color="light"></MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link>Details</MDBDropdownItem>
                  <MDBDropdownItem link>Edit in calendar</MDBDropdownItem>
                  <MDBDropdownItem link>Delete event</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
              <div className="fw-bold card-title name-value">
                {this.state.masterActivity.name}
              </div>
              <p className="text-muted card-text">
                <FontAwesomeIcon icon={faCalendarDays} className="fore-icon" />
                <span className="date-value">{this.state.date}</span>
              </p>

              <p className="text-muted card-text address-value">
                {this.state.masterActivity.address}
              </p>
              <p className="category-name">
                <span href="" className="text-muted card-text">
                  {this.state.masterActivity.category.name}
                </span>
              </p>
            </div>
          </div>
        </li>
        <li className="timeline-transport">
          <FontAwesomeIcon icon={faCar} /> 30 mins
        </li>
      </React.Fragment>
    );
  }
}

export default TripDetail;
