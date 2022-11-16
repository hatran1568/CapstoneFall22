import React from "react";
import axios from "../../api/axios";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import data from "./data.json";
import style from "./Map.module.css";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Marker, Tooltip } from "react-leaflet";
import { Popup } from "react-leaflet";
import L from "leaflet";
import TripGeneralInfo from "../GeneralInfo/TripGeneralInfo";
import TripDetailTabs from "../GeneralInfo/TripDetailTabs";
function Map(props) {
  const { id } = useParams();
  const [selectedPoi, setSelectedPOI] = useState();
  const [trip, setTrip] = useState(null);
  const [allDates, setAllDates] = useState([]);
  const [allMonths, setAllMonths] = useState([]);
  const [daySelected, setDaySelected] = useState();
  const markerRef = useRef(null);

  useEffect(() => {
    console.log(id);

    axios.get(`http://localhost:8080/trip/` + id).then((res) => {
      setTrip(res.data);
      setDaySelected(1);
      setAllDates(getAllDates(res.data.startDate, res.data.endDate));
      setAllMonths(
        getAllMonths(getAllDates(res.data.startDate, res.data.endDate))
      );
    });
  }, []);

  const getAllMonths = (dateArr) => {
    var monthArr = [];
    dateArr.forEach((date) => {
      var month = date.toLocaleString("default", { month: "long" });
      if (!monthArr.includes(month)) monthArr.push(month);
    });
    return monthArr;
  };
  const getAllDates = (start, end) => {
    let arr = [];

    for (
      let dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    console.log(arr);
    return arr;
  };

  const getAllDatesOfMonth = (dateArr, month) => {
    var arr = [];
    dateArr.forEach((dt) => {
      if (dt.toLocaleString("default", { month: "long" }) == month) {
        arr.push(new Date(dt));
      }
    });
    return arr;
  };
  const getTripDetailById = (id) => {
    var arr = trip.listTripDetails.find((element) => {
      return element.tripDetailsId === id;
    });
    if (arr.length > 0) return arr[0];
    return {};
  };
  //get all trip details in a day
  const getTripDetailsByDate = (date) => {
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
  useEffect(() => {
    if (markerRef.current != null) markerRef.current.fire("mouseover");
  }, [selectedPoi]);
  const vietMonths = {
    January: "Tháng Một",
    February: "Tháng Hai",
    March: "Tháng Ba",
    April: "Tháng Tư",
    May: "Tháng Năm",
    June: "Tháng Sáu",
    July: "Tháng Bảy",
    August: "Tháng Tám",
    September: "Tháng Chín",
    October: "Tháng Mười",
    November: "Tháng Mười Một",
    December: "Tháng Mười Hai",
  };
  const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  function getMarker(text) {
    return L.divIcon({
      className: "custom-div-icon",
      html:
        "<div style='background-color:#4838cc;' class='marker-pin'></div><span>" +
        text +
        "</span>",
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });
  }
  const changeDay = (e) => {
    console.log(e);
    setDaySelected(e);
  };
  const toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = 0;

    return [hours, minutes]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };
  return (
    <div>
      <TripGeneralInfo />
      <TripDetailTabs />
      <div div className="container ">
        <div className="timeline-container row ">
          <div className="col-2">
            <div className={style.daysBox}>
              {allMonths.length > 0 &&
                allMonths.map((month, index) => (
                  <div key={month} className={style.monthsBox}>
                    <div className={style.month}>{vietMonths[month]}</div>
                    {getAllDatesOfMonth(allDates, month).map(
                      (date, subindex, arr) => (
                        <a
                          key={date}
                          onClick={() =>
                            changeDay(index * arr.length + subindex + 1)
                          }
                          className={style.date}
                        >
                          {date.getDate()}
                        </a>
                      )
                    )}
                    <a onClick={() => changeDay(0)} className={style.date}>
                      All
                    </a>
                  </div>
                ))}
            </div>
          </div>
          <div className="col-10 ">
            <div className="container">
              <div className={"row " + style.infoBox}>
                <div className={"col-8 " + style.mapBox}>
                  <MapContainer
                    center={[21.0285649, 105.8492929]}
                    zoom={15}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {trip &&
                      trip.listTripDetails.map(
                        (mark, index) =>
                          (daySelected == 0 ||
                            daySelected == mark.dayNumber) && (
                            <Marker
                              ref={selectedPoi == index + 1 ? markerRef : null}
                              position={[
                                mark.masterActivity.latitude,
                                mark.masterActivity.longitude,
                              ]}
                              icon={getMarker(index + 1)}
                            >
                              <Tooltip direction="top" offset={[0, -30]}>
                                <h5>{mark.masterActivity.name}</h5>
                                <div className={style.poiTime}>
                                  {new Date(
                                    new Date(trip.startDate).getTime() +
                                      (mark.dayNumber - 1) * 86400000
                                  ).toDateString()}
                                </div>
                                <div className={style.poiTime}>
                                  {toHHMMSS(mark.startTime)} -{" "}
                                  {toHHMMSS(mark.endTime)}
                                </div>
                              </Tooltip>
                            </Marker>
                          )
                      )}
                  </MapContainer>
                  <button
                    onClick={() => {
                      setSelectedPOI(Math.floor(Math.random() * 5) + 1);
                      markerRef.current.fire("mouseout");
                    }}
                  >
                    Test
                  </button>
                </div>
                <div className={"col-4 " + style.mapBox}>
                  <h4 className={style.tripName}>
                    &nbsp;&nbsp;{trip && trip.name}
                  </h4>
                  {trip &&
                    trip.listTripDetails.map(
                      (mark, index) =>
                        (daySelected == 0 || daySelected == mark.dayNumber) && (
                          <div className={"container " + style.poiContainer}>
                            <div className="row">
                              <div className={"col-2 "}>
                                <div
                                  onMouseOver={() => {
                                    setSelectedPOI(index + 1);
                                    markerRef.current.fire("mouseout");
                                  }}
                                  onMouseLeave={() => {
                                    setSelectedPOI(-1);
                                    markerRef.current.fire("mouseout");
                                  }}
                                  className={style.numberCircle}
                                >
                                  {" "}
                                  {index + 1}
                                </div>
                              </div>
                              <div className={"col-8 "}>
                                <a
                                  href={
                                    "../poi?id=" +
                                    mark.masterActivity.activityId
                                  }
                                  className={style.poiName}
                                >
                                  {mark.masterActivity.name}{" "}
                                </a>
                              </div>
                            </div>
                          </div>
                        )
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Map;
