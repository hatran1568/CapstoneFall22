import React, { Component } from "react";
import style from "./HomePage.module.css";
import axios from "../../api/axios";
class RecentTrips extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      count: 0,
    };
  }
  componentDidMount() {
    const countUrl = "/trip/get-public-trips/count";
    axios
      .get(countUrl)
      .then((res) => {
        const count = res.data;
        this.setState({
          count: count,
          dataLoaded: true,
        });
      })
      .catch((error) => {
        console.log("Error getting data", error);
        this.setState({
          error: true,
        });
      });
  }
  render() {
    if (!this.state.dataLoaded) return null;
    return (
      <div
        className={style.recentTrips}
        onClick={() => (window.location.href = "/recent-plans")}
      >
        <div className={style.number}>{this.state.count}</div>
        <div className={style.text}>
          chuyến đi được lên kế hoạch tháng vừa qua
        </div>
      </div>
    );
  }
}

export default RecentTrips;
