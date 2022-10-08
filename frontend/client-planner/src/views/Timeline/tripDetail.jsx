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
  render() {
    var moment = require("moment"); // require
    return (
      <React.Fragment>
        <li className="timeline-item card">
          {/* <MDBBtn className="btn-close" color="none"></MDBBtn> */}
          <div className="card-body row">
            <div className="col-2">
              <p className="text-muted card-text">
                {moment(this.state.startTime, "HH:mm:ss").format("hh:mm a")}
                <br />
                {moment(this.state.endTime, "HH:mm:ss").format("hh:mm a")}
              </p>
            </div>
            <div className="col-4">
              <img
                src={this.state.activity.images[0].url}
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
                {this.state.activity.name}
              </div>
              <p className="text-muted card-text">
                <FontAwesomeIcon icon={faCalendarDays} className="fore-icon" />
                <span className="date-value">{this.state.date}</span>
              </p>

              <p className="text-muted card-text address-value">
                {this.state.activity.address}
              </p>
              <p className="category-name">
                <a href="" className="text-muted card-text">
                  {this.state.activity.category.name}
                </a>
              </p>
            </div>

            {/* <div className="col-2 btn-group-vertical">
              <button type="button" className="btn btn-delete">
                <FontAwesomeIcon icon={faTrash} />
              </button>

              <button type="button" className="btn btn-edit">
                <FontAwesomeIcon icon={faPen} />
              </button>
            </div> */}
            {/* <div className="col-2">
              <MDBDropdown animation={false}>
                <MDBDropdownToggle
                  className="btn-more"
                  color="light"
                ></MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link>Details</MDBDropdownItem>
                  <MDBDropdownItem link>Edit in calendar</MDBDropdownItem>
                  <MDBDropdownItem link>Delete event</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </div> */}
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
