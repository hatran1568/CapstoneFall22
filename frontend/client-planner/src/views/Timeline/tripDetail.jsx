import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import {
  faCalendarDays,
  faCar,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import style from "./timeline.module.css";
import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBTooltip,
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBBtn,
} from "mdb-react-ui-kit";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import EditActivityModal from "./EditActivityModal";
import axios from "axios";
import { StyleOutlined } from "@mui/icons-material";
class TripDetail extends Component {
  state = {};
  //set state of component based on props from timeline
  constructor(props) {
    super(props);
    this.state = {
      tripDetail: props.tripDetail,
      distanceToNext: -1,
      showEditModal: false,
    };
  }
  //set distance to next activity
  componentDidMount() {
    this.setDistanceState();
  }
  //get distance to next activity and set state
  setDistanceState = () => {
    if (this.props.nextActivityId != -1) {
      axios
        .get(`http://localhost:8080/trip/get-distance`, {
          params: {
            from: this.state.tripDetail.masterActivity.activityId,
            to: this.props.nextActivityId,
          },
        })
        .then((res) => {
          var newState = this.state;
          if (res.status == 404) {
            newState.distanceToNext = -1;
          }
          newState.distanceToNext = res.data;
          this.setState(newState);
        });
    }
  };
  //set distance again after props.nextActivityId changes
  componentDidUpdate(prevProps) {
    if (prevProps.nextActivityId !== this.props.nextActivityId) {
      this.setDistanceState();
    }
  }
  //close edit modal, update inside component, and fire edit event in parent component
  fireEditEvent = (event, input) => {
    this.toggleEditModal();
    var newInput = { ...input };
    this.updateNewDetail(input);
    this.props.editEvent(event, newInput);
  };
  //set state with edited details
  updateNewDetail = (input) => {
    var start = input.startTime.split(":");
    input.startTime = +start[0] * 60 * 60 + +start[1] * 60;
    var end = input.endTime.split(":");
    input.endTime = +end[0] * 60 * 60 + +end[1] * 60;
    var newState = this.state;
    newState.tripDetail = input;
    this.setState(newState);
  };
  //toggle edit modal
  toggleEditModal = () => {
    var newState = this.state;
    newState.showEditModal = !newState.showEditModal;
    this.setState(newState);
  };
  //get time by hours and minutes from seconds
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
        <li className={`${style.timelineItem} card`}>
          <div className="card-body row">
            <div className="col-2">
              {this.props.isConflicting && (
                <>
                  {/* <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="topleft"
                    onMouseOver={() => {
                      console.log("hovering");
                    }}
                  />
                  <div className="ttip">Hello</div> */}
                  <OverlayTrigger
                    trigger={["hover", "focus"]}
                    placement={"bottom"}
                    overlay={
                      <Popover id={`popover-positioned-bottom`}>
                        <Popover.Header as="h3">{`Popover bottom`}</Popover.Header>
                        <Popover.Body>
                          <strong>Holy guacamole!</strong> Check this info.
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <FontAwesomeIcon
                      variant="secondary"
                      icon={faCircleExclamation}
                      className="topleft"
                    />
                  </OverlayTrigger>
                </>
              )}
              <p className={`text-muted card-text ${style.timeText}`}>
                {moment(
                  this.getTimeFromSecs(this.state.tripDetail.startTime),
                  "HH:mm:ss"
                ).format("hh:mm a")}
                <br />
                {moment(
                  this.getTimeFromSecs(this.state.tripDetail.endTime),
                  "HH:mm:ss"
                ).format("hh:mm a")}
              </p>
            </div>
            <div className="col-4">
              <img
                src={
                  this.state.tripDetail.masterActivity.listImages
                    ? this.state.tripDetail.masterActivity.listImages[0]
                      ? this.state.tripDetail.masterActivity.listImages[0].url
                      : "https://picsum.photos/seed/picsum/300/200"
                    : "https://picsum.photos/seed/picsum/300/200"
                }
                className={style.activityImg}
              ></img>
            </div>
            <div className="col-6">
              <MDBDropdown animation={false} className={style.btnMore}>
                <MDBDropdownToggle color="light"></MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link>Details</MDBDropdownItem>
                  <MDBDropdownItem link onClick={this.toggleEditModal}>
                    Edit Event
                  </MDBDropdownItem>
                  <MDBDropdownItem
                    link
                    onClick={(event) =>
                      this.props.deleteEvent(
                        event,
                        this.state.tripDetail.tripDetailsId
                      )
                    }
                  >
                    Delete event
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
              <div className="fw-bold card-title name-value">
                {this.state.tripDetail.masterActivity.name
                  ? this.state.tripDetail.masterActivity.name
                  : ""}
              </div>
              <p className="text-muted card-text">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className={style.foreIcon}
                />
                <span className="date-value">{this.state.tripDetail.date}</span>
              </p>

              <p className="text-muted card-text address-value">
                {this.state.tripDetail.masterActivity.address}
              </p>
              <p className="category-name">
                <span href="" className="text-muted card-text">
                  {this.state.tripDetail.masterActivity.category
                    ? this.state.tripDetail.masterActivity.category.name
                    : ""}
                </span>
              </p>
            </div>
          </div>
        </li>
        <li className={style.timelineTransport}>
          <FontAwesomeIcon icon={faCar} />{" "}
          {this.state.distanceToNext != -1
            ? this.state.distanceToNext + "km"
            : ""}
        </li>

        <EditActivityModal
          show={this.state.showEditModal}
          onHide={this.toggleEditModal}
          allDates={this.props.allDates}
          tripDetail={this.state.tripDetail}
          activityEdited={(event, input) => this.fireEditEvent(event, input)}
        />
      </React.Fragment>
    );
  }
}

export default TripDetail;