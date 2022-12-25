import React, { Component } from "react";
import style from "./TripGeneralInfo.module.css";
import axios from "../../api/axios";
import { useParams } from "react-router-dom";
import ContentEditable from "react-contenteditable";
import LoadingScreen from "react-loading-screen";
import moment from "moment/moment";
import "moment/locale/vi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import EditTripDatesModal from "./EditTripDatesModal";
import CloneTripModal from "../../components/Trips/CloneTripModal";
class TripGeneralInfo extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      trip: {},
      dataLoaded: false,
      showEditDates: false,
      showCloneModal: false,
    };
    this.contentEditable = React.createRef();
  }
  componentDidMount() {
    const { id } = this.props.params;
    axios.get(`/trip/general/` + id).then((res) => {
      const tripData = res.data;
      var own = false;
      if (tripData.user && tripData.user == localStorage.getItem("id")) {
        own = true;
      }
      this.setState({
        trip: tripData,
        dataLoaded: true,
        tripName: tripData.name,
        own: own,
      });
    });
  }
  handleOnBlur = () => {
    if (this.state.own) {
      var newName = this.contentEditable.current.textContent.substring(0, 200);
      if (newName.trim().length == 0) {
        newName = this.state.tripName;
        this.setState({ tripName: newName });
      }
      const data = {
        tripId: this.state.trip.tripId,
        name: newName,
      };
      axios.post("/trip/edit-name", data);
    }
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
    if (this.state.own) {
      this.setState({ showEditDates: true });
    } else this.openCloneModal();
  };
  editDates = (data) => {
    if (this.state.own) {
      axios.post("/trip/edit-dates", data).then((response) => {
        console.log("response: ", response);
      });
      this.closeEditDates();
      window.location.reload();
    }
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
          text="Vui lòng đợi trong khi chúng tôi lấy thông tin chuyến đi..."
        >
          <div></div>
        </LoadingScreen>
      );
    var imgUrl = this.state.trip.image
      ? this.state.trip.image.includes("img/", 0)
        ? `../${this.state.trip.image}`
        : this.state.trip.image
      : "../img/default/jp-mountain.jpg";

    return (
      <div>
        {this.state.own ? (
          <EditTripDatesModal
            show={this.state.showEditDates}
            onHide={this.closeEditDates}
            trip={this.state.trip}
            onChange={(data) => this.editDates(data)}
          />
        ) : (
          <CloneTripModal
            show={this.state.showCloneModal}
            onHide={this.closeCloneModal}
            tripId={this.state.trip.tripId}
            tripStartDate={this.state.trip.startDate}
            tripEndDate={this.state.trip.endDate}
          />
        )}
        <div className={style.tripImageDiv}>
          <img src={imgUrl} className={style.tripImage}></img>
          <div className={style.infoBox}>
            <ContentEditable
              html={this.state.tripName}
              className={style.planTitle}
              onPaste={this.pasteAsPlainText}
              onKeyPress={this.disableNewlines}
              spellCheck={false}
              onBlur={this.handleOnBlur}
              innerRef={this.contentEditable}
              disabled={!this.state.own}
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
