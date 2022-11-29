import React, { Component } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { INITIAL_EVENTS, createEventId } from "./event-utils";
import TripDetailTabs from "../GeneralInfo/TripDetailTabs";
import style from "./timetable.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingScreen from "react-loading-screen";
import ConfirmDelete from "./ConfirmDelete";
import NotificationModal from "./NotificationModal";
import TripGeneralInfo from "../GeneralInfo/TripGeneralInfo";
import CloneTripModal from "../../components/Trips/CloneTripModal";
import DetailActivityModal from "./DetailActivityModal";
import TripNotFound from "../../components/Trips/TripNotFound";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  faPlus,
  faCaretRight,
  faCaretLeft,
  faXmark,
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
      delete: {
        detailId: "",
        name: "",
        show: false,
      },
      showNotiModal: false,
      showCloneModal: false,
      detailInView: {},
      showDetailModal: false,
    };
  }
  componentDidMount() {
    const { id } = this.props.params;
    const userId = localStorage.getItem("id") ? localStorage.getItem("id") : -1;
    axios
      .get(`/trip/` + id + "?userId=" + userId)
      .then((res) => {
        const tripData = res.data;
        var tempEvents = [];
        tripData.listTripDetails.forEach((detail) => {
          if (detail.startTime < detail.endTime) {
            var event = {};
            event.id = detail.tripDetailsId;
            event.title = detail.masterActivity.name;
            var date = new Date(detail.date);
            date.setSeconds(detail.startTime);
            event.start = date.toISOString().substring(0, 19);
            var endDate = new Date(detail.date);
            endDate.setSeconds(detail.endTime);
            event.end = endDate.toISOString().substring(0, 19);
            event.detail = detail;
            event.constraint = "available";
            tempEvents.push(event);
          }
        });
        var tzoffset = new Date().getTimezoneOffset() * 60000;
        var endDt = new Date(tripData.endDate);
        var newEndDt = new Date(endDt - tzoffset);
        newEndDt.setDate(newEndDt.getDate() + 1);
        tempEvents.push({
          groupId: "available",
          start: tripData.startDate,
          end: newEndDt.toISOString().substring(0, 10),
          display: "background",
        });
        var snext = false;
        if (
          this.addDays(tripData.endDate, 0) >
          this.addDays(tripData.startDate, 3)
        ) {
          snext = true;
        }
        var own = false;
        if (tripData.user && tripData.user == localStorage.getItem("id")) {
          own = true;
        }
        this.setState(
          {
            trip: tripData,
            dataLoaded: true,
            currentEvents: tempEvents,
            initialDate: tripData.startDate,
            currentDate: tripData.startDate,
            showNext: snext,
            own: own,
          },
          () => {
            window.scrollTo(0, 600);
          }
        );
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 404) {
            this.setState({
              dataLoaded: true,
              trip: null,
            });
          }
          if (error.response.status >= 500) {
            this.showToastError("Có lỗi xảy ra. Vui lòng thử lại sau.");
          }
        }
      });
  }
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
  }; //get all months of a trip
  getAllMonths = (dateArr) => {
    var monthArr = [];
    dateArr.forEach((date) => {
      var month = date.toLocaleString("vi", { month: "long" });
      if (!monthArr.includes(month)) monthArr.push(month);
    });
    return monthArr;
  }; //get all dates of a month in the trip
  getAllDatesOfMonth = (dateArr, month) => {
    var arr = [];
    dateArr.forEach((dt) => {
      if (dt.toLocaleString("vi", { month: "long" }) == month) {
        arr.push(new Date(dt));
      }
    });
    return arr;
  };
  //set first date on the timetable
  setDate = (event, date) => {
    event.preventDefault();
    let calendarApi = this.calendarComponentRef.current.getApi();
    let endDate = this.state.trip.endDate;
    let startDate = this.state.trip.startDate;
    let targetDate = new Date();
    if (this.addDays(endDate, 0) >= this.addDays(date, 3)) {
      targetDate = date;
    } else if (this.addDays(endDate, 0) >= this.addDays(startDate, 3)) {
      targetDate = this.addDays(endDate, -3);
    } else return;
    calendarApi.gotoDate(targetDate); // call a method on the Calendar object
    var showN = false;
    showN = this.showNextBtn(targetDate);
    var showP = false;
    showP = this.showPrevBtn(targetDate);
    this.setState({
      showNext: showN,
      showPrev: showP,
      currentDate: targetDate,
    });
  };
  //convert time from api to event time
  apiToEventTime = (apiDate, apiTime) => {
    var date = new Date(apiDate);
    date.setSeconds(apiTime);
    return date.toISOString().substring(0, 19);
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

  //toggle notification
  toggleNotification = () => {
    var newShow = this.state.showNotiModal;
    this.setState({ showNotiModal: !newShow });
  };
  //close edit modal
  closeEditModal = () => {
    this.setState({ showEditModal: false, detailInEdit: {} });
  };
  //open edit modal with event data
  openEditModal = (event, detail) => {
    event.preventDefault();
    this.setState({ detailInEdit: detail }, () => {
      this.setState({ showEditModal: true });
    });
  };
  //close detail modal
  closeDetailModal = () => {
    this.setState({ showDetailModal: false, detailInView: {} });
  };
  //open detail modal with event data
  openDetailModal = (event, detail) => {
    event.preventDefault();
    this.setState({ detailInView: detail }, () => {
      this.setState({ showDetailModal: true });
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
    event.stopPropagation();
    this.setState({
      delete: {
        detailId: detailId,
        name: name,
        show: true,
      },
    });
  };
  closeCloneModal = () => {
    this.setState({ showCloneModal: false });
  };
  openCloneModal = () => {
    this.setState({ showCloneModal: true });
  };
  //rendering
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
    var allDates = this.getAllDates(
      this.state.trip.startDate,
      this.state.trip.endDate
    );
    var allMonths = this.getAllMonths(allDates);
    document.title = this.state.trip.name + " | Tripplanner";
    return (
      <>
        <TripGeneralInfo />
        <TripDetailTabs
          own={this.state.own}
          status={this.state.trip.status}
          tripId={this.state.trip.tripId}
        />
        <a className={` ${style.btnAdd}`} onClick={this.toggleAddModal}>
          <FontAwesomeIcon icon={faPlus} className={style.addIcon} />
        </a>
        <DetailActivityModal
          show={this.state.showDetailModal}
          onHide={this.closeDetailModal}
          tripDetail={this.state.detailInView}
        />
        {!this.state.own ? (
          <>
            <CloneTripModal
              show={this.state.showCloneModal}
              onHide={this.closeCloneModal}
              tripId={this.state.trip.tripId}
              tripStartDate={this.state.trip.startDate}
              tripEndDate={this.state.trip.endDate}
            />
          </>
        ) : (
          <>
            <ConfirmDelete
              show={this.state.delete.show}
              onHide={this.closeConfirmDelete}
              onConfirmed={(event, id) => this.deleteEvent(event, id)}
              detailId={this.state.delete.detailId}
              name={this.state.delete.name}
            />
            <AddActivityModal
              show={this.state.showAddModal}
              onHide={this.toggleAddModal}
              allDates={allDates}
              activityAdded={(event, input) =>
                this.insertTripDetail(event, input)
              }
            />
            <NotificationModal
              show={this.state.showNotiModal}
              message="Hoạt động không thể kéo dài trên 1 ngày."
              onHide={this.toggleNotification}
            />
          </>
        )}

        {this.state.showEditModal ? (
          <EditActivityModal
            show={this.state.showEditModal}
            onHide={this.closeEditModal}
            allDates={allDates}
            tripDetail={this.state.detailInEdit}
            activityEdited={(event, input) => this.editTripDetail(event, input)}
          ></EditActivityModal>
        ) : null}
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="container">
          <div className={`row ${style.mainContainer}`}>
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
            <div className={`col-10 ${style.calendarDiv}`}>
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
                // locale={viLocale}
                initialView="timeGridFourDay"
                views={{
                  timeGridFourDay: {
                    type: "timeGrid",
                    duration: { days: 4 },
                    buttonText: "4 day",
                    dayHeaderFormat: {
                      weekday: "long",
                      month: "numeric",
                      day: "numeric",
                      omitCommas: true,
                    },
                  },
                }}
                // timeFormat="hh(:mm)"
                slotLabelFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  omitZeroMinute: false,
                  hour12: false,
                }}
                locale="vi"
                height="auto"
                allDaySlot={false}
                slotDuration="00:15:00"
                slotLabelInterval="01:00:00"
                eventBorderColor="white"
                eventBackgroundColor="white"
                eventTextColor="black"
                initialDate={this.state.trip.startDate}
                editable={this.state.own}
                selectable={false}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={this.state.weekendsVisible}
                initialEvents={this.state.currentEvents} // alternatively, use the `events` setting to fetch from a feed
                // select={this.handleDateSelect}
                eventContent={this.renderEventContent} // custom render function
                // eventClick={this.handleEventClick}
                //eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
                /* you can update a remote database when these fire:
            eventAdd={function(){}}*/
                eventDrop={this.handleEventChange}
                eventResize={this.handleEventChange}
                eventRemove={this.deleteEventApi}
                nextDayThreshold="00:00:00"
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  renderEventContent = (eventInfo) => {
    if (eventInfo.event.groupId && eventInfo.event.groupId == "available") {
      return;
    }
    var newProps = { ...eventInfo.event.extendedProps.detail };
    var tzoffset = new Date().getTimezoneOffset() * 60000;
    newProps.date = new Date(eventInfo.event.start - tzoffset)
      .toISOString()
      .substring(0, 10);

    var startStr = getTimeString(eventInfo.event.start).split(":");
    var start = +startStr[0] * 60 * 60 + +startStr[1] * 60;
    var endStr = getTimeString(eventInfo.event.end).split(":");
    var end = +endStr[0] * 60 * 60 + +endStr[1] * 60;
    newProps.startTime = getTimeString(eventInfo.event.start);
    newProps.endTime = getTimeString(eventInfo.event.end);
    return (
      <div
        className={style.fcEvent}
        onClick={(event) => {
          if (!this.state.own) this.openDetailModal(event, newProps);
          else this.openEditModal(event, newProps);
        }}
      >
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
        {this.state.own ? (
          <div className={style.dropdown}>
            <button
              type="button"
              className={style.moreBtn}
              onClick={(event) =>
                this.openConfirmDelete(
                  event,
                  eventInfo.event.id,
                  eventInfo.event.title
                )
              }
            >
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
          </div>
        ) : null}
      </div>
    );
  };
  //handle event change
  handleEventChange = (eventInfo) => {
    if (eventInfo.event.start.getDay() !== eventInfo.event.end.getDay()) {
      this.setState({ showNotiModal: true });
      eventInfo.revert();
      return;
    }
    var detail = {};
    var start = getTimeString(eventInfo.event.start).split(":");
    detail.startTime = +start[0] * 60 * 60 + +start[1] * 60;
    var end = getTimeString(eventInfo.event.end).split(":");
    detail.endTime = +end[0] * 60 * 60 + +end[1] * 60;

    detail.tripDetailsId = eventInfo.event.id;
    var tzoffset = new Date().getTimezoneOffset() * 60000;
    detail.date = new Date(eventInfo.event.start - tzoffset)
      .toISOString()
      .substring(0, 10);
    axios({
      method: "put",
      url: "/trip/put-detail?id=" + detail.tripDetailsId,
      headers: {
        "Content-Type": "application/json",
      },
      data: detail,
    })
      .then((response) => {
        this.showToastSuccess();
      })
      .catch(function (error) {
        console.log(error);
        this.showToastError();
      });
  };
  //delete from timetable
  deleteEvent = (event, id) => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.getEventById(id).remove();
    this.closeConfirmDelete();
  };
  //callback delete from api
  deleteEventApi = (eventInfo) => {
    var detailId = eventInfo.event.id;
    axios
      .delete(`/trip/delete-detail`, {
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
          this.showToastSuccess();
        }
      })
      .catch(function (error) {
        console.log(error);
        this.showToastError();
      });
  };
  //get event from add modal
  //add event to timetable
  addEventToView = (detail) => {
    var event = {};
    // var tzoffset = new Date().getTimezoneOffset() * 60000;
    event.id = detail.tripDetailsId;
    event.title = detail.masterActivity.name;
    var date = new Date(detail.date);
    date.setSeconds(detail.startTime);
    event.start = date.toISOString().substring(0, 19);
    var endDate = new Date(detail.date);
    endDate.setSeconds(detail.endTime);
    event.end = endDate.toISOString().substring(0, 19);
    event.detail = detail;
    event.constraint = "available";
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.addEvent(event);
  };
  //insert custom trip detail
  insertCustomDetail = (input) => {
    var start = input.start_time.split(":");
    var startSeconds = +start[0] * 60 * 60 + +start[1] * 60;
    var end = input.end_time.split(":");
    var endSeconds = +end[0] * 60 * 60 + +end[1] * 60;
    const data = {
      date: input.date,
      startTime: startSeconds,
      endTime: endSeconds,
      name: input.name,
      address: input.address,
      tripId: this.state.trip.tripId,
      note: input.note ? input.note : "",
    };
    console.log("custom data: ", data);
    axios
      .post(`/trip/add-custom-detail`, data)
      .then((response) => {
        var newDetail = response.data;
        this.addEventToView(newDetail);
        this.setState({
          showAddModal: false,
        });
        this.showToastSuccess();
      })
      .catch(function (error) {
        console.log(error);
        this.setState({ showAddModal: false });
        this.showToastError;
      });
  };
  //insert an activity into the trip
  insertTripDetail = (event, input) => {
    if (input.custom && input.custom == true) {
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
      .post(`/trip/add-detail`, data)
      .then((response) => {
        var newDetail = response.data;
        this.addEventToView(newDetail);
        this.setState({
          showAddModal: false,
        });
        this.showToastSuccess();
      })
      .catch(function (error) {
        console.log(error);
        this.setState({
          showAddModal: false,
        });
        this.showToastSuccess();
      });
  };
  //update an event in timetable
  editEventInView = (detail) => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    let event = calendarApi.getEventById(detail.tripDetailsId);
    event.setStart(this.apiToEventTime(detail.date, detail.startTime));
    event.setEnd(this.apiToEventTime(detail.date, detail.endTime));
    event.setExtendedProp("detail", detail);
    this.closeEditModal();
  };
  //update a custom event in timetable
  editCustomEventInView = (detail) => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    let event = calendarApi.getEventById(detail.tripDetailsId);
    event.setExtendedProp("detail", detail);
    event.setStart(this.apiToEventTime(detail.date, detail.startTime));
    event.setEnd(this.apiToEventTime(detail.date, detail.endTime));
    event.setProp("title", detail.masterActivity.name);
    this.closeEditModal();
  };
  //put request to edit a detail
  editTripDetail = (event, detail) => {
    if (detail.masterActivity.custom == true) {
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
        "Content-Type": "application/json",
      },
      data: detail,
    })
      .then((response) => {
        this.editEventInView(response.data);
        this.showToastSuccess();
      })
      .catch(function (error) {
        console.log(error);
        this.showToastError();
      });
  };
  //put request to edit a custom detail
  editCustomDetail = (event, detail) => {
    var start = detail.startTime.split(":");
    detail.startTime = +start[0] * 60 * 60 + +start[1] * 60;
    var end = detail.endTime.split(":");
    detail.endTime = +end[0] * 60 * 60 + +end[1] * 60;
    console.log("edit custom detail: ", detail);
    axios({
      method: "put",
      url:
        "/trip/put-custom-detail?detailId=" +
        detail.tripDetailsId +
        "&tripId=" +
        this.state.trip.tripId,
      headers: {
        "Content-Type": "application/json",
      },
      data: detail,
    })
      .then((response) => {
        this.editCustomEventInView(response.data);
        this.showToastSuccess();
      })
      .catch(function (error) {
        console.log(error);
        this.showToastError();
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
      window.confirm(
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
  showToastSuccess = (message) => {
    if (message === undefined) message = "Lưu thay đổi thành công!";
    toast.success(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  showToastError = (message) => {
    if (message === undefined)
      message = "Đã có lỗi xảy ra, vui lòng thử lại sau.";
    toast.error(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
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
