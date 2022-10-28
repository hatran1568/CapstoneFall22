import React, { Component, useRef } from "react";
import { withRouter } from "react-router-dom";
import TripDetail from "./TimelineTripDetail";
import AddActivityModal from "./AddActivityModal";
import axios from "axios";
import TripDetailTabs from "./TripDetailTabs";
import style from "./timeline.module.css";
import { useParams } from "react-router-dom";
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
    };
  }
  //get request to get trip info
  componentDidMount() {
    const { id } = this.props.params;
    axios.get(`http://localhost:8080/trip/` + id).then((res) => {
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
  //delete an activirty
  deleteTripDetail = (event, detailId) => {
    if (
      window.confirm("Do you really want to delete this event from your trip?")
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
  //put request to edit a custom detail
  editCustomDetail = (event, detail) => {
    console.log("calling custom");
    delete detail.custom;
    var start = detail.startTime.split(":");
    detail.startTime = +start[0] * 60 * 60 + +start[1] * 60;
    var end = detail.endTime.split(":");
    detail.endTime = +end[0] * 60 * 60 + +end[1] * 60;
    axios({
      method: "put",
      url:
        "http://localhost:8080/trip/put-custom-detail?id=" +
        detail.tripDetailsId,
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
  //put request to edit a detail
  editTripDetail = (event, detail) => {
    if (detail.custom == true) {
      this.editCustomDetail(event, detail);
      return;
    }
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
  //insert custom trip detail
  insertCustomDetail = (input) => {
    var start = input.start_time.split(":");
    var startSeconds = +start[0] * 60 * 60 + +start[1] * 60;
    var end = input.end_time.split(":");
    var endSeconds = +end[0] * 60 * 60 + +end[1] * 60;
    axios
      .post(`http://localhost:8080/trip/add-custom-detail`, {
        date: input.date,
        startTime: startSeconds,
        endTime: endSeconds,
        name: input.name,
        address: input.address,
        tripId: this.state.trip.tripId,
      })
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
        <TripDetailTabs />

        <div className="container ">
          <div className="timeline-container row ">
            <div className="col-2">
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
                <section
                  id={date.toISOString().split("T")[0]}
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
                </section>
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

function withParams(Component) {
  return (props) => {
    return <Component {...props} params={useParams()} />;
  };
}
export default withParams(Timeline);
