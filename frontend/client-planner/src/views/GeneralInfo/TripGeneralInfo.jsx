import React, { Component } from "react";
import style from "./TripGeneralInfo.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import ContentEditable from "react-contenteditable";
import LoadingScreen from "react-loading-screen";
import moment from "moment/moment";
import "moment/locale/vi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import EditTripDatesModal from "./EditTripDatesModal";
class TripGeneralInfo extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      trip: {},
      dataLoaded: false,
      showEditDates: false,
    };
    this.contentEditable = React.createRef();
  }
  componentDidMount() {
    const { id } = this.props.params;
    axios.get(`http://localhost:8080/trip/general/` + id).then((res) => {
      const tripData = res.data;
      this.setState({
        trip: tripData,
        dataLoaded: true,
        tripName: tripData.name,
      });
    });
  }
  handleOnBlur = () => {
    var newName = this.contentEditable.current.textContent.substring(0, 200);
    if (newName.trim().length == 0) {
      newName = this.state.tripName;
      this.setState({ tripName: newName });
    }
    const data = {
      tripId: this.state.trip.tripId,
      name: newName,
    };
    axios.post("http://localhost:8080/trip/edit-name", data);
  };
  toLongDate = (date) => {
    var options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    var today = new Date(date);
    return today.toLocaleDateString("en-US", options);
  };
  pasteAsPlainText = (event) => {
    event.preventDefault();

    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  };
  disableNewlines = (event) => {
    const keyCode = event.keyCode || event.which;

    if (keyCode === 13) {
      event.returnValue = false;
      if (event.preventDefault) event.preventDefault();
    }
  };
  closeEditDates = () => {
    this.setState({ showEditDates: false });
  };
  openEditDates = () => {
    this.setState({ showEditDates: true });
  };
  editDates = (data) => {
    axios.post("http://localhost:8080/trip/edit-dates", data);
    this.closeEditDates();
    let newTrip = this.state.trip;
    newTrip.startDate = data.startDate;
    newTrip.endDate = data.endDate;
    this.setState({ trip: newTrip });
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
    var imgUrl = this.state.trip.image;
    return (
      <div>
        <EditTripDatesModal
          show={this.state.showEditDates}
          onHide={this.closeEditDates}
          trip={this.state.trip}
          onChange={(data) => this.editDates(data)}
        />
        <div className={style.tripImageDiv}>
          <img
            src={
              imgUrl
                ? `../${imgUrl}`
                : "https://twimg0-a.akamaihd.net/a/1350072692/t1/img/front_page/jp-mountain@2x.jpg"
            }
            className={style.tripImage}
          ></img>
          <div className={style.infoBox}>
            <ContentEditable
              html={this.state.tripName}
              className={style.planTitle}
              onPaste={this.pasteAsPlainText}
              onKeyPress={this.disableNewlines}
              spellCheck={false}
              onBlur={this.handleOnBlur}
              innerRef={this.contentEditable}
            />
            <div className={style.datesDiv}>
              <h2 className={style.dates}>
                {moment(this.state.trip.startDate).locale("vi").format("ll")}
                {" - "}
                {moment(this.state.trip.endDate).locale("vi").format("ll")}
              </h2>
              <button type="button" onClick={this.openEditDates}>
                <FontAwesomeIcon icon={faPen} /> {"  "}
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}
export default withParams(TripGeneralInfo);
