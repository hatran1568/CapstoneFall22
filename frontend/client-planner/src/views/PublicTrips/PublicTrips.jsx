import React, { Component } from "react";
import style from "./PublicTrips.module.css";
import LoadingScreen from "react-loading-screen";
import { MDBCard, MDBCardImage } from "mdb-react-ui-kit";
import ReactPaginate from "react-paginate";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Slider from "@mui/material/Slider";
import Button from "react-bootstrap/Button";
class PublicTrips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      trips: [],
      error: false,
      gettingData: false,
      daysRange: [1, 100],
      search: "",
      pageCount: 0,
      resultsCount: 0,
    };
    this.searchInputRef = React.createRef();
  }
  state = {};
  componentDidMount() {
    this.getData("", 1, 100, 0);
    this.getCount("", 1, 100);
  }
  getData = (search, minDays, maxDays, page) => {
    const url = `/trip/get-public-trips`;
    const params =
      "?page=" +
      page +
      "&search=" +
      search +
      "&minDays=" +
      minDays +
      "&maxDays=" +
      maxDays;
    axios
      .get(url + params)
      .then((res) => {
        const trips = res.data;
        this.setState({
          trips: trips,
          dataLoaded: true,
          minDays: 1,
          maxDays: 100,
        });
      })
      .catch((error) => {
        console.log("Error getting data", error);
        this.setState({
          dataLoaded: true,
          error: true,
        });
      });
  };
  getCount = (search, minDays, maxDays) => {
    const countUrl = "/trip/get-public-trips/count";
    const params =
      "?search=" + search + "&minDays=" + minDays + "&maxDays=" + maxDays;
    axios
      .get(countUrl + params)
      .then((res) => {
        const count = res.data;
        this.setState({
          resultsCount: count,
          pageCount: Math.ceil(count / 12),
        });
      })
      .catch((error) => {
        console.log("Error getting data", error);
        this.setState({
          error: true,
        });
      });
  };
  getTripName = () => {};
  search = (event) => {
    if (event.target.value.trim() != this.state.search) {
      this.setState({ search: event.target.value, daysRange: [1, 100] }, () => {
        this.getData(event.target.value, 1, 100, 0);
        this.getCount(event.target.value, 1, 100);
      });
      event.target.blur();
    }
  };
  handleSearchClick = () => {
    const query = this.searchInputRef.current.value.trim();
    if (query != this.state.search) {
      this.setState({ search: query, daysRange: [1, 100] }, () => {
        this.getData(query, 1, 100, 0);
        this.getCount(query, 1, 100);
      });
    }
    this.searchInputRef.current.blur();
  };
  handleSliderChange = (event, newValue) => {
    this.setState({ daysRange: newValue });
  };
  applyDaysRange = () => {
    this.getData(
      this.state.search,
      this.state.daysRange[0],
      this.state.daysRange[1],
      0
    );
    this.getCount(
      this.state.search,
      this.state.daysRange[0],
      this.state.daysRange[1]
    );
  };
  resetDaysRange = () => {
    this.setState({ daysRange: [1, 100] }, () => {
      this.getData(this.state.search, 1, 100, 0);
      this.getCount(this.state.search, 1, 100);
    });
  };
  handlePageClick = (event) => {
    window.scrollTo(0, 0);
    this.getData(
      this.state.search,
      this.state.daysRange[0],
      this.state.daysRange[1],
      event.selected
    );
  };
  getAll = () => {
    this.setState({ daysRange: [1, 100], search: "" });
    this.getData("", 1, 100, 0);
    this.getCount("", 1, 100);
    this.searchInputRef.current.value = "";
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
          text="Vui lòng đợi trong khi chúng tôi lấy thông tin ..."
        >
          <div></div>
        </LoadingScreen>
      );
    document.title = "Chuyến đi gần đây | Tripplanner";
    return (
      <div>
        <div className={style.bgImageDiv}>
          <img
            src={"../img/default/road-trip.jpg"}
            className={style.bgImage}
          ></img>
          <div className={style.infoBox}>
            <div className={style.pageTitle}>
              Những chuyến đi được tạo gần đây
            </div>
          </div>
        </div>
        <div className={`container ${style.mainContainer}`}>
          <div className="row">
            <div className="col-3"></div>
            <div className="col-9">
              <div className={`input-group rounded ${style.searchBox}`}>
                <input
                  type="search"
                  className="form-control rounded"
                  placeholder="Tìm kiếm các chuyến đi theo tên hoặc điểm đến"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  ref={this.searchInputRef}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      this.search(event);
                    }
                  }}
                />
                <span
                  className={`input-group-text border-0 ${style.searchBtn}`}
                  id="search-addon"
                  onClick={this.handleSearchClick}
                >
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className={`col-3 ${style.filterBox}`}>
              <div className={style.filterTitle}>Bộ lọc</div>
              <label className={style.label}>Số ngày trong chuyến đi:</label>
              <div className={style.daysRangeBox}>
                <Slider
                  getAriaLabel={() => "Temperature range"}
                  value={this.state.daysRange}
                  step={1}
                  max={100}
                  min={1}
                  onChange={this.handleSliderChange}
                  valueLabelDisplay="auto"
                  // getAriaValueText={valuetext}
                />
                <span>
                  ({this.state.daysRange[0]} {" - "} {this.state.daysRange[1]}{" "}
                  {" ngày"})
                </span>
                <div className={style.btnGroup}>
                  <Button
                    variant="outline-dark"
                    className={style.submitBtn}
                    size="sm"
                    onClick={this.resetDaysRange}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="outline-dark"
                    className={style.applyBtn}
                    size="sm"
                    onClick={this.applyDaysRange}
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-9">
              {this.state.search.length > 0 ? (
                <div>
                  Có {this.state.resultsCount} chuyến đi theo tìm kiếm của bạn.
                  <Button
                    variant="outline-dark"
                    className={style.applyBtn}
                    size="sm"
                    onClick={this.getAll}
                  >
                    Xem tất cả các chuyến đi khác
                  </Button>
                </div>
              ) : null}
              <div class={`row row-cols-3 g-3 ${style.tripsList}`}>
                {this.state.trips.map((trip) => (
                  <div class="col" key={trip.tripId}>
                    <MDBCard
                      className={style.card}
                      onClick={() => {
                        window.location.href = "../timeline/" + trip.tripId;
                      }}
                    >
                      <MDBCardImage
                        className={style.img}
                        src={
                          trip.image
                            ? trip.image
                            : "https://i.picsum.photos/id/1015/6000/4000.jpg?hmac=aHjb0fRa1t14DTIEBcoC12c5rAXOSwnVlaA5ujxPQ0I"
                        }
                        alt="..."
                      />
                      <div className={style.cardTitle}>
                        <p className={style.tripName}>{trip.name}</p>
                        <p className={style.numberOfDays}>
                          {trip.numberOfDays}
                          {" ngày"}
                        </p>
                      </div>
                      {/* {trip.destinations[0] ? (
                        <div className={style.description}>
                          <div>{trip.destinations[0]}</div>
                        </div>
                      ) : null} */}
                      <div className={style.description}>
                        {trip.pois.map((poi, index) => (
                          <span key={index}>
                            {poi}
                            {index < trip.pois.length - 1 ? " • " : ""}
                          </span>
                        ))}
                      </div>
                    </MDBCard>
                  </div>
                ))}
              </div>
              <div className={`${style.paginate}`}>
                <ReactPaginate
                  nextLabel=" >"
                  onPageChange={this.handlePageClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={this.state.pageCount}
                  previousLabel="<"
                  pageClassName={`page-item ${style.pageItem}`}
                  pageLinkClassName={`page-link ${style.pageLink}`}
                  previousClassName={`page-item ${style.pageItem}`}
                  previousLinkClassName={`page-link ${style.pageLink}`}
                  nextClassName={`page-item ${style.pageItem}`}
                  nextLinkClassName={`page-link ${style.pageLink}`}
                  breakLabel="..."
                  breakClassName={`page-item ${style.pageItem}`}
                  breakLinkClassName={`page-link ${style.pageLink}`}
                  containerClassName={`pagination ${style.customPagination}`}
                  activeClassName={`active ${style.active}`}
                  renderOnZeroPageCount={null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function withParams(Component) {
  return (props) => {
    const queryParams = new URLSearchParams(window.location.search);
    const navigate = useNavigate();
    return (
      <Component {...props} queryParams={queryParams} navigate={navigate} />
    );
  };
}
export default withParams(PublicTrips);
