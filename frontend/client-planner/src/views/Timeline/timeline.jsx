import React, { Component, useRef } from "react";
import { withRouter } from "react-router-dom";
import TripDetail from "./TimelineTripDetail";
import AddActivityModal from "./AddActivityModal";
import axios from "../../api/axios";
import TripDetailTabs from "../GeneralInfo/TripDetailTabs";
import style from "./timeline.module.css";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import LoadingScreen from "react-loading-screen";
import ConfirmDelete from "../Timetable/ConfirmDelete";
import EditActivityModal from "./EditActivityModal";
import TripGeneralInfo from "../GeneralInfo/TripGeneralInfo";
import CloneTripModal from "../../components/Trips/CloneTripModal";
import TripNotFound from "../../components/Trips/TripNotFound";
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
      showAddCustomModal: false,
      detailInEdit: {},
      showEditModal: false,
      delete: {
        detailId: "",
        name: "",
        show: false,
      },
      showCloneModal: false,
    };
  }
  //get request to get trip info
  componentDidMount() {
    const { id } = this.props.params;
    const userId = localStorage.getItem("id") ? localStorage.getItem("id") : -1;
    axios
      .get(`/trip/` + id + "?userId=" + userId)
      .then((res) => {
        const tripData = res.data;
        var own = false;
        if (tripData.userID && tripData.userID == userId) {
          own = true;
        }
        this.setState({
          trip: tripData,
          showAddModal: false,
          showEditModal: false,
          dataLoaded: true,
          own: own,
        });
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          if (error.response.status == 404) {
            this.setState({
              dataLoaded: true,
              trip: null,
            });
          }
        }
      });
  }
  //get all months of a trip
  getAllMonths = (dateArr) => {
    var monthArr = [];
    dateArr.forEach((date) => {
      var month = date.toLocaleString("vi", { month: "long" });
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
      if (dt.toLocaleString("vi", { month: "long" }) == month) {
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
    if (!this.state.own) {
      this.openCloneModal();
      return;
    }
    var newShow = this.state.showAddModal;
    this.setState({ showAddModal: !newShow });
  };
  //toggle custom modal
  toggleAddCustomModal = () => {
    this.setState({ showAddCustomModal: true });
  };
  //change add type
  changeAddType = () => {
    var newShow = this.state.showAddModal;
    var newShowCustom = this.state.showAddCustomModal;
    this.setState({
      showAddModal: !newShow,
    });
    this.setState({
      showAddCustomModal: !newShowCustom,
    });
  };
  //delete an activity
  deleteTripDetail = (event, detailId) => {
    axios
      .delete(
        `/trip/delete-detail`,
        {
          data: { id: detailId },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        if (response.status == 200) {
          var newTrip = this.state.trip;
          newTrip.listTripDetails = newTrip.listTripDetails.filter(function (
            detail
          ) {
            return detail.tripDetailsId !== detailId;
          });
          this.setState({
            trip: newTrip,
            showAddModal: false,
            showEditModal: false,
            dataLoaded: true,
            delete: {
              detailId: "",
              name: "",
              show: false,
            },
          });
        }
      });
  };
  //get a tripDetail inside trip in state
  getTripDetailById = (id) => {
    var arr = this.state.trip.listTripDetails.find((element) => {
      return element.tripDetailsId === id;
    });
    if (arr.length > 0) return arr[0];
    return {};
  };
  //put request to edit a custom detail
  editCustomDetail = (event, detail) => {
    var start = detail.startTime.split(":");
    detail.startTime = +start[0] * 60 * 60 + +start[1] * 60;
    var end = detail.endTime.split(":");
    detail.endTime = +end[0] * 60 * 60 + +end[1] * 60;
    axios({
      method: "put",
      url:
        "/trip/put-custom-detail?detailId=" +
        detail.tripDetailsId +
        "&tripId=" +
        this.state.trip.tripId,
      data: detail,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    })
      .then((response) => {
        this.updateDetail(detail.tripDetailsId, response.data);
        this.closeEditModal();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //put request to edit a detail
  editTripDetail = (event, detail) => {
    if (detail.masterActivity.custom) {
      this.editCustomDetail(event, detail);
      return;
    }
    var start = detail.startTime.split(":");
    detail.startTime = +start[0] * 60 * 60 + +start[1] * 60;
    var end = detail.endTime.split(":");
    detail.endTime = +end[0] * 60 * 60 + +end[1] * 60;
    axios({
      method: "put",
      url: "/trip/put-detail?id=" + detail.tripDetailsId,

      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,

      data: detail,
    })
      .then((response) => {
        this.updateDetail(detail.tripDetailsId, response.data);
        this.closeEditModal();
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
  //insert custom trip detail
  insertCustomDetail = (input) => {
    var start = input.start_time.split(":");
    var startSeconds = +start[0] * 60 * 60 + +start[1] * 60;
    var end = input.end_time.split(":");
    var endSeconds = +end[0] * 60 * 60 + +end[1] * 60;
    axios
      .post(
        `/trip/add-custom-detail`,
        {
          date: input.date,
          startTime: startSeconds,
          endTime: endSeconds,
          name: input.name,
          address: input.address,
          tripId: this.state.trip.tripId,
          note: input.note,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("custom response: ", response);
        var newDetail = response.data;
        var newTrip = this.state.trip;
        newTrip.listTripDetails.push(newDetail);
        this.setState(
          {
            trip: newTrip,
            showAddModal: false,
            dataLoaded: true,
          },
          this.render
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //insert an activity into the trip
  insertTripDetail = (event, input) => {
    if (input.custom == true) {
      this.insertCustomDetail(input);
      return;
    }
    var start = input.start_time.split(":");
    var startSeconds = +start[0] * 60 * 60 + +start[1] * 60;
    var end = input.end_time.split(":");
    var endSeconds = +end[0] * 60 * 60 + +end[1] * 60;
    const data = {
      date: input.date,
      startTime: startSeconds,
      endTime: endSeconds,
      activityId: input.activity_id,
      tripId: this.state.trip.tripId,
      note: input.note ? input.note : "",
    };
    console.log("data: ", data);
    axios
      .post(`/trip/add-detail`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        var newDetail = response.data;
        var newTrip = this.state.trip;
        newTrip.listTripDetails.push(newDetail);
        this.setState({
          strip: newTrip,
          showAddModal: false,
          dataLoaded: true,
        });
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
  //close confirm delete
  closeConfirmDelete = () => {
    this.setState({
      delete: {
        detailId: "",
        name: "",
        show: false,
      },
    });
  };
  //open confirm delete modal
  openConfirmDelete = (event, detailId, name) => {
    if (!this.state.own) {
      this.openCloneModal();
      return;
    } else {
      this.setState({
        delete: {
          detailId: detailId,
          name: name,
          show: true,
        },
      });
    }
  };
  //open edit modal with event data
  openEditModal = (event, detail) => {
    event.preventDefault();
    if (!this.state.own) {
      this.openCloneModal();
      return;
    } else {
      var newDetail = {};
      newDetail.date = detail.date;
      var date = new Date(detail.date);
      date.setSeconds(detail.startTime);
      var timeString = date.toISOString().substring(11, 16);
      newDetail.startTime = timeString;
      var enddate = new Date(detail.date);
      enddate.setSeconds(detail.endTime);
      var endtimeString = enddate.toISOString().substring(11, 16);
      newDetail.endTime = endtimeString;
      newDetail.masterActivity = detail.masterActivity;
      newDetail.tripDetailsId = detail.tripDetailsId;
      newDetail.note = detail.note;
      this.setState({ detailInEdit: newDetail }, () => {
        this.setState({ showEditModal: true });
      });
    }
  };
  //close edit modal
  closeEditModal = () => {
    this.setState({ showEditModal: false, detailInEdit: {} });
  };
  closeCloneModal = () => {
    this.setState({ showCloneModal: false });
  };
  openCloneModal = () => {
    this.setState({ showCloneModal: true });
  };
  render() {
    if (!this.state.dataLoaded)
      return (
        <LoadingScreen
          loading={true}
          bgColor="#f1f1f1"
          spinnerColor="#9ee5f8"
          textColor="#676767"
          // logoSrc="/logo.png"
          text="Please wait a bit while we get your plan..."
        >
          <div></div>
        </LoadingScreen>
      );
    if (this.state.dataLoaded && this.state.trip == null) {
      return <TripNotFound />;
    }
    document.title = this.state.trip.name + " | Tripplanner";
    var allDates = this.getAllDates(
      this.state.trip.startDate,
      this.state.trip.endDate
    );
    var allMonths = this.getAllMonths(allDates);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return (
      <div>
        <TripGeneralInfo />
        <TripDetailTabs />
        {this.state.showEditModal ? (
          <EditActivityModal
            show={this.state.showEditModal}
            onHide={this.closeEditModal}
            allDates={allDates}
            tripDetail={this.state.detailInEdit}
            activityEdited={(event, input) => this.editTripDetail(event, input)}
          ></EditActivityModal>
        ) : null}
        {!this.state.own ? (
          <CloneTripModal
            show={this.state.showCloneModal}
            onHide={this.closeCloneModal}
            tripId={this.state.trip.tripId}
            tripStartDate={this.state.trip.startDate}
            tripEndDate={this.state.trip.endDate}
          />
        ) : (
          <ConfirmDelete
            show={this.state.delete.show}
            onHide={this.closeConfirmDelete}
            onConfirmed={(event, id) => this.deleteTripDetail(event, id)}
            detailId={this.state.delete.detailId}
            name={this.state.delete.name}
          />
        )}
        <div className="container ">
          <div className="timeline-container row ">
            <div className="col-2">
              <div className={style.daysBox}>
                {allMonths.map((month) => (
                  <div key={month} className={style.monthsBox}>
                    <div className={style.month}>{month}</div>
                    {this.getAllDatesOfMonth(allDates, month).map((date) => (
                      <a
                        href={"#" + date.toISOString().split("T")[0]}
                        key={date}
                        className={style.date}
                      >
                        {date.getDate()}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-8">
              {allDates.map((date, index) => (
                <section
                  id={date.toISOString().split("T")[0]}
                  key={date.toISOString().split("T")[0]}
                >
                  <div>
                    <div className={style.detailsGroupDate}>
                      <span className={style.dayNum}>Ngày {index + 1}</span>
                      {date.toLocaleDateString("vi", options)}
                    </div>
                    <ul className={style.timeline}>
                      {this.getTripDetailsByDate(date).length > 0 ? (
                        this.getTripDetailsByDate(date).map((tripDetail) => (
                          <TripDetail
                            key={tripDetail.tripDetailsId}
                            tripDetail={tripDetail}
                            deleteEvent={(event, detailId, name) =>
                              this.openConfirmDelete(event, detailId, name)
                            }
                            editEvent={(event, detail) => {
                              console.log("opening edit");
                              this.openEditModal(event, detail);
                            }}
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
                        ))
                      ) : (
                        <div className={style.emptyDay}>
                          <span>Thời gian trống.</span>
                          <br />
                          <span>
                            Bạn chưa có hoạt động nào trong ngày này.{" "}
                          </span>
                          <a
                            onClick={this.toggleAddModal}
                            className={style.addActivity}
                          >
                            Thêm hoạt động
                          </a>
                        </div>
                      )}
                    </ul>
                  </div>
                </section>
              ))}
            </div>
            <div className="col-2"></div>
          </div>
          <a className={` ${style.btnAdd}`} onClick={this.toggleAddModal}>
            <FontAwesomeIcon icon={faPlus} className={style.addIcon} />
          </a>
        </div>
        {this.state.showAddModal ? (
          <AddActivityModal
            show={this.state.showAddModal}
            onHide={this.toggleAddModal}
            allDates={allDates}
            activityAdded={(event, input) =>
              this.insertTripDetail(event, input)
            }
          />
        ) : null}
      </div>
    );
  }
}

function withParams(Component) {
  return (props) => {
    return <Component {...props} params={useParams()} />;
  };
}
export default withParams(Timeline);
