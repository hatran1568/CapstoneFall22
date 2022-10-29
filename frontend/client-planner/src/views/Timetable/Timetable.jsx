import React, { Component } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import TripDetailTabs from "../Timeline/TripDetailTabs";
import style from "./timetable.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPlus,
  faCircleInfo,
  faPenToSquare,
  faTrash,
  faCaretRight,
  faCaretLeft,
} from "@fortawesome/free-solid-svg-icons";
import AddActivityModal from "../Timeline/AddActivityModal";
import EditActivityModal from "./EditActivityModal";

// import "@fullcalendar/core/main.css";
import "./timetable.css";

class Timetable extends Component {
  calendarComponentRef = React.createRef();
  state = {
    weekendsVisible: true,
    currentEvents: [],
  };
  //set state of component
  constructor(props) {
    super(props);
    this.state = {
      weekendsVisible: true,
      currentEvents: [],
      trip: {},
      showAddModal: false,
      showEditModal: false,
      dataLoaded: false,
      showAddCustomModal: false,
      initialDate: "",
      detailInEdit: {},
      currentDate: "",
      showNext: false,
      showPrev: false,
    };
  }
  componentDidMount() {
    const { id } = this.props.params;
    axios.get(`http://localhost:8080/trip/` + id).then((res) => {
      const tripData = res.data;
      var tempEvents = [];
      tripData.listTripDetails.forEach((detail) => {
        var event = {};
        event.id = detail.tripDetailsId;
        event.title = detail.masterActivity.name;
        var date = new Date(detail.date);
        date.setSeconds(detail.startTime);
        event.start = date.toISOString().substring(0, 19);
        var endDate = new Date(detail.date);
        endDate.setSeconds(detail.endTime);
        event.end = endDate.toISOString().substring(0, 19);
        event.extendedProps = detail;
        // event.color = "blue";
        tempEvents.push(event);
      });
      var snext = false;
      if (this.getAllDates(tripData.startDate, tripData.endDate).length > 1) {
        snext = true;
      }
      this.setState(
        {
          trip: tripData,
          dataLoaded: true,
          currentEvents: tempEvents,
          initialDate: tripData.startDate,
          currentDate: tripData.startDate,
          showNext: snext,
        },
        () => {
          window.scrollTo(0, 600);
        }
      );
    });
  } //get all dates in the trip
  getAllDates = (start, end) => {
    for (
      var arr = [], dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  }; //get all months of a trip
  getAllMonths = (dateArr) => {
    var monthArr = [];
    dateArr.forEach((date) => {
      var month = date.toLocaleString("default", { month: "long" });
      if (!monthArr.includes(month)) monthArr.push(month);
    });
    return monthArr;
  }; //get all dates of a month in the trip
  getAllDatesOfMonth = (dateArr, month) => {
    var arr = [];
    dateArr.forEach((dt) => {
      if (dt.toLocaleString("default", { month: "long" }) == month) {
        arr.push(new Date(dt));
      }
    });
    return arr;
  };
  //set first date on the timetable
  setDate = (event, date) => {
    event.preventDefault();
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.gotoDate(date); // call a method on the Calendar object
    this.setState({ currentDate: date });
  };
  //convert time from api to event time
  apiToEventTime = (apiDate, apiTime) => {
    var date = new Date(apiDate);
    date.setSeconds(apiTime);
    return date.toISOString().substring(0, 19);
  };
  //toggle add modal
  toggleAddModal = () => {
    var newShow = this.state.showAddModal;
    this.setState({ showAddModal: !newShow });
  };
  //close edit modal
  closeEditModal = () => {
    this.setState({ showEditModal: false });
  };
  //open edit modal with event data
  openEditModal = (event, detail) => {
    event.preventDefault();
    this.setState({ detailInEdit: detail }, () => {
      this.setState({ showEditModal: true });
    });
  };
  //get the current date in the view
  getCurrentDate = () => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    let currDate = calendarApi.getDate();
    currDate.setDate(currDate.getDate() + 1);
    return currDate.toISOString().substring(0, 10);
  };
  //add a number of days to a date
  addDays = (date, dayNum) => {
    var newDate = new Date(date);
    newDate.setDate(newDate.getDate() + dayNum);
    return newDate;
  };
  //check to show next btn
  showNextBtn = (currDate) => {
    let endDate = this.state.trip.endDate;
    return this.addDays(endDate, 0) > this.addDays(currDate, 3) ? true : false;
  };
  //check to show prev button
  showPrevBtn = (currDate) => {
    // let currDate = this.state.currentDate;
    let startDate = this.state.trip.startDate;
    return this.addDays(startDate, 0) < this.addDays(currDate, 0)
      ? true
      : false;
  };
  //increment date
  incrementDate = () => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.incrementDate({ days: 1 });
    let newCurDate = this.addDays(this.state.currentDate, 1);
    var showN = false;
    showN = this.showNextBtn(newCurDate);
    var showP = false;
    showP = this.showPrevBtn(newCurDate);
    this.setState({
      showNext: showN,
      showPrev: showP,
      currentDate: newCurDate,
    });
  };
  //decrementDate date
  decrementDate = () => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.incrementDate({ days: -1 });
    let newCurDate = this.addDays(this.state.currentDate, -1);
    var showN = false;
    showN = this.showNextBtn(newCurDate);
    var showP = false;
    showP = this.showPrevBtn(newCurDate);
    this.setState({
      showNext: showN,
      showPrev: showP,
      currentDate: newCurDate,
    });
  };
  //rendering
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
      <>
        <TripDetailTabs />
        <a className={` ${style.btnAdd}`} onClick={this.toggleAddModal}>
          <FontAwesomeIcon icon={faPlus} className={style.addIcon} />
        </a>
        <AddActivityModal
          show={this.state.showAddModal}
          onHide={this.toggleAddModal}
          allDates={allDates}
          activityAdded={(event, input) => this.insertTripDetail(event, input)}
        />
        {this.state.showEditModal && (
          <EditActivityModal
            show={this.state.showEditModal}
            onHide={this.closeEditModal}
            allDates={allDates}
            tripDetail={this.state.detailInEdit}
            activityEdited={(event, input) => this.editTripDetail(event, input)}
          ></EditActivityModal>
        )}

        <div className="container">
          <div className="row">
            <div className="col-1">
              <div className={style.daysBox}>
                {allMonths.map((month) => (
                  <div key={month}>
                    <div className={style.month}>{month}</div>
                    {this.getAllDatesOfMonth(allDates, month).map((date) => (
                      <a
                        href=""
                        onClick={(event) =>
                          this.setDate(event, date.toISOString().split("T")[0])
                        }
                        key={date}
                        //className={style.date}
                        className={
                          new Date(date) >= new Date(this.state.currentDate)
                            ? `${style.date} ${style.dateActive}`
                            : `${style.date}`
                        }
                      >
                        {date.getDate()}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className={`col-11 ${style.calendarDiv}`}>
              {this.state.showNext && (
                <a
                  className={` ${style.nextBtn} ${style.navBtn}`}
                  onClick={this.incrementDate}
                >
                  <FontAwesomeIcon
                    icon={faCaretRight}
                    className={` ${style.navIcon}`}
                  />
                </a>
              )}
              {this.state.showPrev && (
                <a
                  className={` ${style.prevBtn} ${style.navBtn}`}
                  onClick={this.decrementDate}
                >
                  <FontAwesomeIcon
                    icon={faCaretLeft}
                    className={` ${style.navIcon}`}
                  />
                </a>
              )}

              <FullCalendar
                ref={this.calendarComponentRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "",
                  right: "",
                  center: "",
                }}
                initialView="timeGridFourDay"
                views={{
                  timeGridFourDay: {
                    type: "timeGrid",
                    duration: { days: 4 },
                    buttonText: "4 day",
                  },
                }}
                // timeFormat="hh(:mm)"
                slotLabelFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  omitZeroMinute: false,
                  hour12: false,
                }}
                locale="en-gb"
                height="auto"
                allDaySlot={false}
                slotDuration="00:15:00"
                slotLabelInterval="01:00:00"
                eventBorderColor="white"
                eventBackgroundColor="white"
                eventTextColor="black"
                initialDate={this.state.trip.startDate}
                editable={true}
                selectable={false}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={this.state.weekendsVisible}
                initialEvents={this.state.currentEvents} // alternatively, use the `events` setting to fetch from a feed
                // select={this.handleDateSelect}
                eventContent={this.renderEventContent} // custom render function
                // eventClick={this.handleEventClick}
                eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
                /* you can update a remote database when these fire:
            eventAdd={function(){}}*/
                eventChange={this.handleEventChange}
                eventRemove={this.deleteEventApi}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  renderEventContent = (eventInfo) => {
    var newProps = { ...eventInfo.event.extendedProps };
    newProps.date = eventInfo.event.start.toISOString().substring(0, 10);
    return (
      <div className={style.fcEvent}>
        <div className={style.eventTitle}>{eventInfo.event.title}</div>
        <div>
          <span className={style.duration}>
            {this.getDuration(eventInfo.event.start, eventInfo.event.end)}
          </span>
          <span className={style.startEndTime}>
            {" ("}
            {getTimeString(eventInfo.event.start)}
            {" - "}
            {getTimeString(eventInfo.event.end)}
            {")"}
          </span>
        </div>
        <div className={style.dropdown}>
          <button type="button" className={style.moreBtn}>
            <FontAwesomeIcon icon={faEllipsisVertical} size="xl" />
          </button>
          <div className={style.dropdownMenu}>
            <a className="dropdown-item">
              <FontAwesomeIcon
                icon={faCircleInfo}
                className={style.dropdownIcon}
              />{" "}
              Details
            </a>
            <a
              className="dropdown-item"
              onClick={(event) => this.openEditModal(event, newProps)}
            >
              <FontAwesomeIcon
                icon={faPenToSquare}
                className={style.dropdownIcon}
              />{" "}
              Edit
            </a>
            <a
              className="dropdown-item"
              onClick={(event) => this.deleteEvent(event, eventInfo.event.id)}
            >
              <FontAwesomeIcon icon={faTrash} className={style.dropdownIcon} />
              Remove
            </a>
          </div>
        </div>
      </div>
    );
  };
  //handle event change
  handleEventChange = (eventInfo) => {
    if (eventInfo.event.extendedProps.fromForm == true) return;
    var detail = {};

    var start = getTimeString(eventInfo.event.start).split(":");
    detail.startTime = +start[0] * 60 * 60 + +start[1] * 60;
    var end = getTimeString(eventInfo.event.end).split(":");
    detail.endTime = +end[0] * 60 * 60 + +end[1] * 60;
    detail.tripDetailsId = eventInfo.event.id;
    detail.date = eventInfo.event.start.toISOString().substring(0, 10);
    axios({
      method: "put",
      url: "http://localhost:8080/trip/put-detail?id=" + detail.tripDetailsId,
      headers: {
        "Content-Type": "application/json",
      },
      data: detail,
    })
      .then((response) => {})
      .catch(function (error) {
        console.log(error);
      });
  };
  //delete from timetable
  deleteEvent = (event, id) => {
    event.preventDefault();
    if (confirm("do you reall wanna delete this?")) {
      let calendarApi = this.calendarComponentRef.current.getApi();
      calendarApi.getEventById(id).remove();
    }
  };
  //callback delete from api
  deleteEventApi = (eventInfo) => {
    var detailId = eventInfo.event.id;
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
          this.setState({
            trip: newTrip,
            currentEvents: newTrip.listTripDetails,
          });
        }
      });
  };
  //get event from add modal
  //add event to timetable
  addEventToView = (detail) => {
    var event = {};
    event.id = detail.tripDetailsId;
    event.title = detail.masterActivity.name;
    var date = new Date(detail.date);
    date.setSeconds(detail.startTime);
    event.start = date.toISOString().substring(0, 19);
    var endDate = new Date(detail.date);
    endDate.setSeconds(detail.endTime);
    event.end = endDate.toISOString().substring(0, 19);

    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.addEvent(event);
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
        // console.log("custom response: ", response);
        var newDetail = response.data;
        this.addEventToView(newDetail);
        // var newTrip = this.state.trip;
        // newTrip.listTripDetails.push(newDetail);
        this.setState({
          // trip: newTrip,
          showAddModal: false,
          // dataLoaded: true,
        });
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
        this.addEventToView(newDetail);
        // var newTrip = this.state.trip;
        // newTrip.listTripDetails.push(newDetail);
        this.setState({
          // trip: newTrip,
          showAddModal: false,
          // dataLoaded: true,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //update an event in timetable
  editEventInView = (detail) => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    let event = calendarApi.getEventById(detail.tripDetailsId);
    event.setExtendedProp("fromForm", true);
    event.setStart(this.apiToEventTime(detail.date, detail.startTime));
    event.setEnd(this.apiToEventTime(detail.date, detail.endTime));
    event.setProp("extendedProps", detail);
    this.closeEditModal();
  };
  //update a custom event in timetable
  editCustomEventInView = (detail) => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    let event = calendarApi.getEventById(detail.tripDetailsId);
    event.setProp("extendedProps", detail);
    event.setExtendedProp("fromForm", true);
    event.setStart(this.apiToEventTime(detail.date, detail.startTime));
    event.setEnd(this.apiToEventTime(detail.date, detail.endTime));
    event.setProp("title", detail.masterActivity.name);
    this.closeEditModal();
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
        this.editEventInView(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //put request to edit a custom detail
  editCustomDetail = (event, detail) => {
    console.log("calling custom: ", detail);
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
        console.log("response data: ", response.data);
        this.editCustomEventInView(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  getDuration = (from, to) => {
    var d = Math.abs(from.getTime() - to.getTime()) / 1000;
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var hDisplay = h > 0 ? h + " giờ" : "";
    var mDisplay = m > 0 ? " " + m + " phút" : "";
    return hDisplay + mDisplay;
  };
  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events,
    });
  };
}

function getTimeString(time) {
  return (
    time.getHours().toString().padStart(2, "0") +
    ":" +
    time.getMinutes().toString().padStart(2, "0")
  );
}
function withParams(Component) {
  return (props) => {
    return <Component {...props} params={useParams()} />;
  };
}
export default withParams(Timetable);
