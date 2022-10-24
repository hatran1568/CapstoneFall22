import React, { Component } from "react";
import TripDetailTabs from "./TripDetailTabs";
import style from "./TripGeneralInfo.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
class TripGeneralInfo extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      trip: {},
      dataLoaded: false,
    };
  }
  componentDidMount() {
    const { id } = this.props.params;
    axios.get(`http://localhost:8080/trip/` + id).then((res) => {
      const tripData = res.data;
      this.setState({
        trip: tripData,
        dataLoaded: true,
      });
    });
  }
  toLongDate = (date) => {
    var options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    var today = new Date(date);
    return today.toLocaleDateString("en-US", options);
  };
  render() {
    if (!this.state.dataLoaded)
      return (
        <div>
          <h1> Pleses wait some time.... </h1>{" "}
        </div>
      );
    return (
      <div>
        <div className={style.tripImage}>
          <div className={style.infoBox}>
            <h1 className={style.planTitle}>
              {this.state.trip.name ? this.state.trip.name : ""}
            </h1>
            <h2 className={style.dates}>
              {this.toLongDate(this.state.trip.startDate)} -{" "}
              {this.toLongDate(this.state.trip.endDate)}
            </h2>
          </div>
        </div>
        <TripDetailTabs></TripDetailTabs>
      </div>
    );
  }
}

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}
export default withParams(TripGeneralInfo);
