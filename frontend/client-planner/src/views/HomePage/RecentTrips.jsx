import React, { Component } from "react";
import style from "./newhomepage.module.css";
import axios from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
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
      <section
        className={`container ${style.section}  ${style.recentSection} section`}
      >
        <div className={` row `}>
          <div className={`col-md-10 ${style.smallRecentSection}`}>
            <div
              className={style.recentTrips}
              onClick={() => (window.location.href = "/recent-plans")}
            >
              <div className={style.number}>{this.state.count}</div>
              {/* <div className={style.number}>10</div> */}
              <div className={style.text}>
                chuyến đi công khai được lên kế hoạch tháng vừa qua
              </div>
            </div>
          </div>
          <div
            className={`col-md-2 ${style.smallRecentSection} ${style.seeRecentButton}`}
          >
            <div
              className={style.recentTrips}
              onClick={() => (window.location.href = "/recent-plans")}
            >
              <div className={style.number}>
                <FontAwesomeIcon icon={faAngleRight} />
              </div>
              {/* <div className={style.number}>10</div> */}
              <div className={`${style.text} ${style.seeMoreText}`}>
                Xem thêm
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default RecentTrips;
