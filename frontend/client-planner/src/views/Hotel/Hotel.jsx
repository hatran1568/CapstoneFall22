import React from "react";
import axios from "../../api/axios";
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Marker, Tooltip } from "react-leaflet";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Popup } from "react-leaflet";
import L from "leaflet";
import style from "./Hotel.module.css";
import { faHotel, faBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CardItem from "./CardItem";
import { MDBListGroupItem, MDBListGroup } from "mdb-react-ui-kit";
import PropTypes from "prop-types";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import TripNotFound from "../../components/Trips/TripNotFound";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBRipple,
  MDBCardSubTitle,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import Select from "react-select";
import POISearchBar from "../../components/POISearchBar/POISearchBar";
import StarRatings from "react-star-ratings";
import styledEngine from "@mui/styled-engine";
function Hotel() {
  const [trip, setTrip] = useState({});
  document.title = "Thêm khách sạn | Tripplanner";
  const PrettoSlider = memo(
    styled(Slider)({
      color: "#52af77",
      height: 8,
      "& .MuiSlider-track": {
        border: "none",
      },
      "& .MuiSlider-thumb": {
        height: 24,
        width: 24,
        backgroundColor: "#fff",
        border: "2px solid currentColor",
        "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
          boxShadow: "inherit",
        },
        "&:before": {
          display: "none",
        },
      },
      "& .MuiSlider-valueLabel": {
        lineHeight: 1.2,
        fontSize: 12,
        background: "unset",
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: "50% 50% 50% 0",
        backgroundColor: "#52af77",
        transformOrigin: "bottom left",
        transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
        "&:before": { display: "none" },
        "&.MuiSlider-valueLabelOpen": {
          transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
        },
        "& > *": {
          transform: "rotate(45deg)",
        },
      },
    }),
  );
  const markerRef = useRef(null);
  const options = [
    { value: "0", label: "Tất cả các mức giá" },
    { value: "1", label: "Dưới 1 triệu đồng" },
    { value: "2", label: "1 triệu - 2 triệu đồng" },
    { value: "3", label: "Trên 3 triệu đồng" },
  ];

  const rateOptions = [
    { value: "0", label: "Từ 1 sao trở lên" },
    { value: "1", label: "Từ 2 sao trở lên" },
    { value: "2", label: "Từ 3 sao trở lên" },
    { value: "3", label: "Từ 4 sao trở lên" },
    { value: "4", label: "Trên 5 sao" },
  ];
  const { tripId } = useParams();
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [pois, setPois] = useState();
  const [distance, setDistance] = useState(3);
  const [isTouchEnded, setIsTouchEnded] = useState(false);
  const [selectedMark, setSelectedMark] = useState();
  const [basicModal, setBasicModal] = useState(false);
  const [hotelSelected, setHotelSelected] = useState();
  const toggleShow = () => setBasicModal(!basicModal);

  const [price, setPrice] = useState({
    value: "0",
    label: "Tất cả các mức giá",
  });
  const [POISelected, setPOISelected] = useState("");
  const [rate, setRate] = useState({ value: "0", label: "Từ 1 sao trở lên" });
  const handleChange = useCallback((e) => {
    setDistance(e.target.childNodes[0].value);
    console.log(e.target.childNodes[0].value);
  }, []);
  const insertTripDetail = () => {
    let count = 0;
    let input = document.getElementById("dayOfTrip");
    if (input.value == "") {
      console.log("ok");
      return;
    }
    input = input.value.split(",");
    input.forEach(async (item, index, array) => {
      const data = {
        date: item.replace(/\//g, "-").trim(),
        startTime: "14400",
        endTime: "18000",
        activityId: hotelSelected,
        tripId: tripId,
        note: "",
      };
      console.log("data: ", data);
      await axios
        .post(`/trip/add-detail`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          count++;
          if (count === array.length) {
            toggleShow();
            toast.success("Thêm vào chuyến đi thành công!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  };
  useEffect(() => {
    let body = JSON.stringify({
      poiId: "-1",
      page: "0",
      distance: "3.0",
      price: "0",
      rate: "0",
    });
    console.log(body);
    axios({
      method: "post",
      url: "http://localhost:8080/location/api/pois/hotel/query",
      data: body,
      headers: {
        "Content-Type": "application/json",
      },
    }).then(function (res) {
      setPois(res.data.list);
      setMaxPage(res.data.totalPage);
    });
    const userId = localStorage.getItem("id") ? localStorage.getItem("id") : -1;
    axios
      .get(`http://localhost:8080/trip/` + tripId + "?userId=" + userId)
      .then((res) => {
        setTrip(res.data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 404) {
            setTrip(null);
            console.log("trip not found");
          }
          if (error.response.status >= 500) {
            setTrip(null);
            console.log("internal server error", error);
          }
        }
      });
  }, []);
  const appendMore = () => {
    let poiSelectedId = -1;
    if (POISelected != "") {
      poiSelectedId = POISelected;
    }
    setPage(page + 1);
    console.log(page);
    let nextPage = page + 1;
    axios({
      method: "post",
      url: "http://localhost:8080/location/api/pois/hotel/query",
      data: {
        poiId: poiSelectedId,
        page: nextPage,
        distance: distance,
        price: price.value,
        rate: rate.value,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      setPois((old) => [...old, ...res.data.list]);
    });
  };
  function getMarker(text) {
    return L.divIcon({
      className: "hotel-custom-div-icon",
      html: "<div  class='hotel-marker-pin'><span>" + text + "</span></div>",
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });
  }
  const handlePrice = (e) => {
    setPrice(e);
  };
  const handleRate = (e) => {
    setRate(e);
  };
  function moneyFormat(price, sign = "$") {
    const pieces = parseFloat(price).toFixed(2).split("");
    let ii = pieces.length - 3;
    while ((ii -= 3) > 0) {
      pieces.splice(ii, 0, ".");
    }
    return pieces.join("").slice(0, -3);
  }
  const handlePOI = (e) => {
    setPOISelected(e.id);
  };
  useEffect(() => {
    console.log(pois);
  }, [pois]);
  useEffect(() => {
    setPage(0);
    let poiSelectedId = -1;
    if (POISelected != "") {
      poiSelectedId = POISelected;
    }
    axios({
      method: "post",
      url: "http://localhost:8080/location/api/pois/hotel/query",
      data: {
        poiId: poiSelectedId,
        page: "0",
        distance: distance,
        price: price.value,
        rate: rate.value,
      },
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (res) {
        console.log(res.data.list);
        setPois(res.data.list);
        setMaxPage(res.data.totalPage);
      })
      .catch(function (error) {
        if (error.response.status == "404") {
          setPois(undefined);
        }
      });
    console.log("change");
  }, [POISelected, price, distance, rate]);
  useEffect(() => {
    if (markerRef.current != null) markerRef.current.fire("mouseover");
  }, [selectedMark]);
  if (trip == null) return <TripNotFound />;
  return (
    <>
      <div className={"container " + style.content}>
        <div>
          <button
            type="button"
            className={`${style.hotelBtn} ${style.hotelBookBtn}`}
            onClick={() => {
              window.location.href = "../timeline/" + tripId;
            }}
          >
            <FontAwesomeIcon icon={faBackward}></FontAwesomeIcon>
            Quay lại kế hoạch chi tiết
          </button>
        </div>
        <div className={"row " + style.filter}>
          <div className="col-3">
            <Typography gutterBottom>
              {"Khoảng cách từ " + distance + " km đến"}
            </Typography>
            <PrettoSlider
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              defaultValue={distance}
              onChangeCommitted={handleChange}
              min={0}
              max={10}
            />
          </div>
          <div className={"col-3 " + style.searchBox}>
            <POISearchBar
              POISelected={handlePOI}
              customStyle={style.poiSearchBar}
              placeholder="Tìm khách sạn xung quanh"
            ></POISearchBar>
          </div>
          <div className={"col-3 " + style.searchBox}>
            <Select
              value={price}
              onChange={handlePrice}
              className={style.poiSearchBar}
              options={options}
            />
          </div>
          <div className="col-3">
            <Select
              value={rate}
              onChange={handleRate}
              className={style.poiSearchBar}
              options={rateOptions}
            />
          </div>
        </div>
        <div className="row">
          <div className={"col-5 " + style.listBox}>
            {pois !== undefined ? (
              <MDBListGroup>
                {pois.map((item) => (
                  <MDBListGroupItem
                    // onClick={() => {
                    //   toggleShow();
                    //   setHotelSelected(item.id);
                    // }}
                    onClick={() => {
                      setSelectedMark(item.id);
                      markerRef.current.fire("mouseout");
                    }}
                    // onMouseLeave={() => {
                    //   setSelectedMark(-1);
                    //   markerRef.current.fire("mouseout");
                    // }}
                    className={style.item}
                  >
                    <CardItem
                      item={item}
                      addHotel={(event) => {
                        event.stopPropagation();
                        toggleShow();
                        setHotelSelected(item.id);
                      }}
                      className={style.item}
                    ></CardItem>
                  </MDBListGroupItem>
                ))}
                <MDBListGroupItem className={style.item}>
                  {maxPage != page ? (
                    <button onClick={appendMore} className={style.showMore}>
                      {" "}
                      Hiển thị thêm kết quả
                    </button>
                  ) : (
                    ""
                  )}
                </MDBListGroupItem>
              </MDBListGroup>
            ) : (
              <div className={style.notFound}>
                Rất tiếc, chúng tôi không tìm được kết quả nào
              </div>
            )}
          </div>
          <div className={"col-7 " + style.mapBox}>
            {pois && (
              <MapContainer
                center={[21.0285649, 105.8492929]}
                zoom={18}
                scrollWheelZoom={true}
              >
                {pois.map((item, index) => (
                  <Marker
                    eventHandlers={{
                      click: () => {
                        toggleShow();
                      },
                    }}
                    ref={selectedMark == item.id ? markerRef : null}
                    position={[item.latitude, item.longitude]}
                    icon={getMarker(moneyFormat(item.price) + "<sup> đ</sup>")}
                  >
                    <Tooltip
                      className={style.tooltip}
                      direction="top"
                      offset={[0, -30]}
                    >
                      <MDBCard className={style.card}>
                        <MDBRipple
                          rippleColor="light"
                          rippleTag="div"
                          className="bg-image hover-overlay"
                        >
                          <MDBCardImage src={item.thumbnail} fluid alt="..." />
                          <a>
                            <div className="mask"></div>
                          </a>
                        </MDBRipple>
                        <MDBCardBody className={style.cardBody}>
                          <MDBCardTitle>
                            <div className={style.cardItemName}>
                              {item.name}
                            </div>
                            <StarRatings
                              style="height:15px;"
                              starDimension="15px"
                              starSpacing="1px"
                              rating={item.rate / 2}
                              starRatedColor="green"
                            ></StarRatings>
                          </MDBCardTitle>
                          <MDBCardSubTitle>
                            <small className="text-muted">
                              {item.numberOfRate == 0
                                ? " "
                                : item.numberOfRate + " reviews"}
                            </small>
                          </MDBCardSubTitle>
                          <MDBCardText>
                            {item.price}
                            <sup> ₫</sup>
                          </MDBCardText>
                        </MDBCardBody>
                      </MDBCard>
                    </Tooltip>
                  </Marker>
                ))}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </MapContainer>
            )}
          </div>
        </div>
      </div>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                Thêm khách sạn cho chuyến đi của bạn
              </MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div>
                Xin hãy chọn ngày trong chuyến đi mà bạn muốn thêm khách sạn
              </div>
              {trip && (
                <DatePicker
                  id="dayOfTrip"
                  onChange={() => {
                    let dates = document.getElementById("dayOfTrip");
                    console.log(dates.value);
                  }}
                  minDate={trip.startDate}
                  maxDate={trip.endDate}
                  multiple
                  plugins={[<DatePanel />]}
                />
              )}
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleShow}>
                Hủy
              </MDBBtn>
              <MDBBtn onClick={insertTripDetail}>Thêm</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        onClick={() => {
          window.location.href = "../timeline/" + tripId;
        }}
      />
      ;
    </>
  );
}

export default Hotel;
