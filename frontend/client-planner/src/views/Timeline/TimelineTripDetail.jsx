import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import {
  faCalendarDays,
  faCar,
  faCircleExclamation,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import style from "./timeline.module.css";
import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import axios from "axios";
import "moment/locale/vi";
import { Link } from "react-router-dom";
import ShowMoreText from "react-show-more-text";
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
    if (this.props.nextActivity) {
      axios
        .get(`http://localhost:8080/trip/get-distance`, {
          params: {
            from: this.state.tripDetail.masterActivity.activityId,
            to: this.props.nextActivity.activityId,
          },
        })
        .then((res) => {
          this.setState({ distanceToNext: Math.round(res.data * 10) / 10 });
        })
        .catch((err) => {
          if (err.response) {
            this.setState({ distanceToNext: -1 });
          }
        });
    }
  };
  //set distance again after props.nextActivity changes
  componentDidUpdate(prevProps) {
    if (prevProps.nextActivity !== this.props.nextActivity) {
      this.setDistanceState();
    }
    if (prevProps.tripDetail !== this.props.tripDetail) {
      this.setState({ tripDetail: this.props.tripDetail });
    }
  }
  //close edit modal, update inside component, and fire edit event in parent component
  fireEditEvent = (event, input) => {
    this.toggleEditModal();
    var newInput = { ...input };
    // this.updateNewDetail(input);
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
    var isCustom = this.state.tripDetail.masterActivity.custom;
    const imageUrl = this.state.tripDetail.masterActivity.images
      ? this.state.tripDetail.masterActivity.images[0]
        ? this.state.tripDetail.masterActivity.images[0].url?.includes(
            "img/",
            0
          )
          ? `../${this.state.tripDetail.masterActivity.images[0].url}`
          : this.state.tripDetail.masterActivity.images[0].url
        : "../img/default/detail-img.jpg"
      : "";
    let address = this.state.tripDetail.masterActivity.address;
    let nextAddress = this.props.nextActivity
      ? this.props.nextActivity.address
      : "";
    let uri = "";
    if (address.length > 0 && nextAddress.length > 0)
      uri =
        "https://www.google.com/maps/dir/?api=1&origin=" +
        address +
        "&destination=" +
        nextAddress;
    let encodedUri = encodeURI(uri);
    return (
      <React.Fragment>
        <li className={`${style.timelineItem} card`}>
          <div className="card-body">
            <div className="row">
              <div className="col-2">
                {this.props.isConflicting && (
                  <>
                    <OverlayTrigger
                      trigger={["hover", "focus"]}
                      placement={"bottom"}
                      overlay={
                        <Popover id={`popover-positioned-bottom`}>
                          <Popover.Body className={style.popover}>
                            <FontAwesomeIcon
                              variant="secondary"
                              icon={faCircleExclamation}
                              className={style.popoverIcon}
                            />
                            <div>
                              Hoạt động này trùng thời gian với hoạt động khác.
                            </div>
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <FontAwesomeIcon
                        variant="secondary"
                        icon={faCircleExclamation}
                        className={style.topLeft}
                      />
                    </OverlayTrigger>
                  </>
                )}
                <p className={`text-muted card-text ${style.timeText}`}>
                  {moment(
                    this.getTimeFromSecs(this.state.tripDetail.startTime),
                    "HH:mm:ss"
                  )
                    .locale("en")
                    .format("hh:mm a")}
                  <br />
                  {moment(
                    this.getTimeFromSecs(this.state.tripDetail.endTime),
                    "HH:mm:ss"
                  )
                    .locale("en")
                    .format("hh:mm a")}
                </p>
              </div>
              {!isCustom ? (
                <div className="col-4">
                  <Link
                    to={
                      "../poi?id=" +
                      this.state.tripDetail.masterActivity.activityId
                    }
                  >
                    <img src={imageUrl} className={style.activityImg}></img>
                  </Link>
                </div>
              ) : (
                <></>
              )}

              <div className={!isCustom ? "col-6" : "col-10"}>
                <MDBDropdown animation={false} className={style.btnMore}>
                  <MDBDropdownToggle color="light"></MDBDropdownToggle>
                  <MDBDropdownMenu>
                    {!isCustom ? (
                      <MDBDropdownItem
                        link
                        href={
                          "../poi?id=" +
                          this.state.tripDetail.masterActivity.activityId
                        }
                      >
                        Xem chi tiết
                      </MDBDropdownItem>
                    ) : (
                      <></>
                    )}

                    <MDBDropdownItem
                      link
                      onClick={(event) =>
                        this.props.editEvent(event, this.state.tripDetail)
                      }
                    >
                      Chỉnh sửa
                    </MDBDropdownItem>
                    <MDBDropdownItem
                      link
                      onClick={(event) =>
                        this.props.deleteEvent(
                          event,
                          this.state.tripDetail.tripDetailsId,
                          this.state.tripDetail.masterActivity.name
                        )
                      }
                    >
                      Xóa hoạt động
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
                <div className="fw-bold card-title name-value">
                  {!isCustom ? (
                    <Link
                      to={
                        "../poi?id=" +
                        this.state.tripDetail.masterActivity.activityId
                      }
                      className={style.detailTitleLink}
                    >
                      {this.state.tripDetail.masterActivity.name}
                    </Link>
                  ) : (
                    <Link
                      onClick={(event) =>
                        this.props.editEvent(event, this.state.tripDetail)
                      }
                      className={style.detailTitleLink}
                    >
                      {this.state.tripDetail.masterActivity.name}
                    </Link>
                  )}
                </div>
                <p className="text-muted card-text">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className={style.foreIcon}
                  />
                  <span className="date-value">
                    {moment(this.state.tripDetail.date)
                      .locale("vi")
                      .format("L")}
                  </span>
                </p>

                <p className="text-muted card-text address-value">
                  {this.state.tripDetail.masterActivity.address}
                </p>
              </div>
            </div>
            {this.state.tripDetail.note && this.state.tripDetail.note != "" ? (
              <div className={style.noteDiv}>
                <span style={{ fontWeight: 500 }}>Ghi chú:</span>
                <ShowMoreText
                  /* Default options */
                  lines={2}
                  more="Xem thêm"
                  less="Rút gọn"
                  anchorClass="show-more-less-clickable"
                  expanded={false}
                  truncatedEndingComponent={"... "}
                >
                  <div>{this.state.tripDetail.note}</div>
                </ShowMoreText>
              </div>
            ) : null}
          </div>
        </li>
        <li
          className={style.timelineTransport}
          onClick={() => {
            if (encodedUri.length > 0 && this.state.distanceToNext != -1)
              window.open(encodedUri);
          }}
        >
          <FontAwesomeIcon icon={faCar} />
          {"  "}
          {this.state.distanceToNext != -1 ? (
            <span>
              {this.state.distanceToNext} km
              <FontAwesomeIcon
                icon={faAngleRight}
                size="2xs"
                className={style.directionIcon}
              />
            </span>
          ) : (
            ""
          )}
        </li>
      </React.Fragment>
    );
  }
}

export default TripDetail;
