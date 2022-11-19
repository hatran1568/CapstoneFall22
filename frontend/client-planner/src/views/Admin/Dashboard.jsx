import React from "react";
import ReactDOM from "react-dom";
import { useState, useRef, useMemo  } from "react";
import { Modal } from "antd";
import { Component } from 'react';
import axios from "../../api/axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import {
  faTrash,
  faEye,
  faEyeSlash,
  faLocationDot,
  faSort,
  faSortUp,
  faSortDown,
  faUsers,
  faPlaceOfWorship,
  faBook,
  faPenToSquare,
  faPlaneDeparture,
  faStar,
  faHotel,
} from "@fortawesome/free-solid-svg-icons";
import style from "./Dashboard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { confirm } = Modal;
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countAll: {},
      countTrip: [],
      countUser: [],
      topRating: [],
      ratingCount: [],
      tripStart: {},
      tripEnd: {},
      topPOIs: [],
      hotelCount: null,
      poiCount: null,
      topCountRating: [],
      dataLoaded: false,
    };
  }
  async componentDidMount()  {
    axios.get("http://localhost:8080/api/admin/countall", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        countAll: data,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    axios.get("http://localhost:8080/api/admin/ratingCount", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        ratingCount: data,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 10);
    var dd2 = String(yesterday.getDate()).padStart(2, '0');
    var mm2 = String(yesterday.getMonth() + 1).padStart(2, '0');
    var yyyy2 = yesterday.getFullYear();
    yesterday = yyyy2 + '-' + mm2 + '-' + dd2;
    axios.get("http://localhost:8080/api/admin/counttrip/" + yesterday + "/" + today, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        countTrip: data,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    axios.get("http://localhost:8080/api/admin/toppoi", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        topPOIs: data,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    axios.get("http://localhost:8080/api/admin/hotelcount", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        hotelCount: data,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    axios.get("http://localhost:8080/api/admin/poicount", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        poiCount: data,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    axios.get("http://localhost:8080/api/admin/toprating", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        topRating: data,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    axios.get("http://localhost:8080/api/admin/topcountrating", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        topCountRating: data,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    await axios.get("http://localhost:8080/api/admin/countuser/" + yesterday + "/" + today, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        countUser: data,
        dataLoaded: true,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 10);
    document.getElementById("tripEnd").valueAsDate = new Date();
    document.getElementById("tripStart").valueAsDate = yesterday;
    document.getElementById("userEnd").valueAsDate = new Date();
    document.getElementById("userStart").valueAsDate = yesterday;
  }

  handleTripChange = async (event) => {
    var today = document.getElementById("tripEnd").valueAsDate;
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    var yesterday = document.getElementById("tripStart").valueAsDate;
    var dd2 = String(yesterday.getDate()).padStart(2, '0');
    var mm2 = String(yesterday.getMonth() + 1).padStart(2, '0');
    var yyyy2 = yesterday.getFullYear();
    yesterday = yyyy2 + '-' + mm2 + '-' + dd2;
    axios.get("http://localhost:8080/api/admin/counttrip/" + yesterday + "/" + today, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        countTrip: data,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
  };
  handleUserChange = async (event) => {
    var today = document.getElementById("userEnd").valueAsDate;
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    var yesterday = document.getElementById("userStart").valueAsDate;
    var dd2 = String(yesterday.getDate()).padStart(2, '0');
    var mm2 = String(yesterday.getMonth() + 1).padStart(2, '0');
    var yyyy2 = yesterday.getFullYear();
    yesterday = yyyy2 + '-' + mm2 + '-' + dd2;
    axios.get("http://localhost:8080/api/admin/countuser/" + yesterday + "/" + today, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        countUser: data,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
  };

  ratingOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Thống kê đánh giá',
      },
    },
  };
  tripOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Thống kê chuyến đi',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      // y1: {
      //   type: 'linear',
      //   display: true,
      //   position: 'right',
      //   grid: {
      //     drawOnChartArea: false,
      //   },
      // },
    },
  };
  userOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Thống kê người dùng mới',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
    },
  };
  render() {
    var tripData = {
      labels: this.state.countTrip.labels,
      datasets: [
        {
          label: 'Số chuyến đi được tạo',
          data: this.state.countTrip.data,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          yAxisID: 'y'
        },
      ],
    };
    const userChart = [];
    const topRatingBox = [];
    const topPOIBox = [];
    const topCountRatingBox = [];
    if (this.state.dataLoaded) {
      var userData = {
        labels: this.state.countUser[0].labels,
        datasets: [
          {
            label: 'Người dùng TPS',
            data: this.state.countUser[0].data,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: 'y'
          },
          {
            label: 'Người dùng Google',
            data: this.state.countUser[1].data,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            yAxisID: 'y'
          },
          {
            label: 'Người dùng Facebook',
            data: this.state.countUser[2].data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            yAxisID: 'y'
          },
        ],
      };
      userChart.push(<Line options={this.userOptions} data={userData}/>);
      topRatingBox.push(
        <MDBRow className={style.ratingBox}>
          <MDBCol className={style.ratingBoxItem}>
            {this.state.topRating[0].name}<br/>
            <FontAwesomeIcon className={style.ratingStar} icon={faStar}/><b>{this.state.topRating[0].rating}<br/>{this.state.topRating[0].count} đánh giá</b>
          </MDBCol>
          <MDBCol className={style.ratingBoxItem}>
            {this.state.topRating[1].name}<br/>
            <FontAwesomeIcon className={style.ratingStar} icon={faStar}/><b>{this.state.topRating[1].rating}<br/>{this.state.topRating[1].count} đánh giá</b>
          </MDBCol>
          <MDBCol className={style.ratingBoxItem}>
            {this.state.topRating[2].name}<br/>
            <FontAwesomeIcon className={style.ratingStar} icon={faStar}/><b>{this.state.topRating[2].rating}<br/>{this.state.topRating[2].count} đánh giá</b>
          </MDBCol><br/>
        </MDBRow>
      );
      topCountRatingBox.push(
        <MDBRow className={style.ratingBox}>
          <MDBCol className={style.ratingBoxItem}>
            {this.state.topCountRating[0].name}<br/>
            <FontAwesomeIcon className={style.ratingStar} icon={faStar}/><b>{this.state.topCountRating[0].rating}<br/>{this.state.topCountRating[0].count} đánh giá</b>
          </MDBCol>
          <MDBCol className={style.ratingBoxItem}>
            {this.state.topCountRating[1].name}<br/>
            <FontAwesomeIcon className={style.ratingStar} icon={faStar}/><b>{this.state.topCountRating[1].rating}<br/>{this.state.topCountRating[1].count} đánh giá</b>
          </MDBCol>
          <MDBCol className={style.ratingBoxItem}>
            {this.state.topCountRating[2].name}<br/>
            <FontAwesomeIcon className={style.ratingStar} icon={faStar}/><b>{this.state.topCountRating[2].rating}<br/>{this.state.topCountRating[2].count} đánh giá</b>
          </MDBCol><br/>
        </MDBRow>
      );
      var colors = ['rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'];
      this.state.topPOIs.forEach((entry, index) => {
        let imgLink = entry.img;
        const imgArr = imgLink.split("/");
        if (imgArr[0] == "img")
          imgLink = "../" + imgLink;
        topPOIBox.push(
          <MDBCol className={style.poiBoxItem}>
            <img className={style.poiImage} src={imgLink}/><br/>
            <b>{entry.name}</b><br/>
            Xuất hiện <b style={{color:colors[index]}}>{entry.count} lần<br/></b> trong các chuyến đi
          </MDBCol>
        )
      });
    }
    var ratingCountData = this.state.ratingCount;
    var ratingData = {
      labels: ['5 sao', '4 sao', '3 sao', '2 sao', '1 sao'],
      datasets: [
        {
          data: ratingCountData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <MDBContainer className={style.bodyContainer}>
        <MDBCard className={style.allCountBox}>
          <h4><b>Thống kê tổng quan</b></h4>
          <MDBRow>
            <MDBCol className={style.countItem}>
              <span className={style.countItemIconBox1}><FontAwesomeIcon icon={faUsers} className={style.countItemIcon}/></span><br/>
              <span className={style.countItemText1}>{this.state.countAll.users}</span><span> Người dùng</span>
            </MDBCol>
            <MDBCol className={style.countItem}>
              <span className={style.countItemIconBox2}><FontAwesomeIcon icon={faPlaceOfWorship} className={style.countItemIcon}/></span><br/>
              <span className={style.countItemText2}>{this.state.countAll.pois}</span><span> Địa điểm</span>
            </MDBCol>
            <MDBCol className={style.countItem}>
              <span className={style.countItemIconBox3}><FontAwesomeIcon icon={faLocationDot} className={style.countItemIcon}/></span><br/>
              <span className={style.countItemText3}>{this.state.countAll.destinations}</span><span> Điểm đến</span>
            </MDBCol>
            <MDBCol className={style.countItem}>
              <span className={style.countItemIconBox4}><FontAwesomeIcon icon={faPlaneDeparture} className={style.countItemIcon}/></span><br/>
              <span className={style.countItemText4}>{this.state.countAll.trips}</span><span> Chuyến đi</span>
            </MDBCol>
            <MDBCol className={style.countItem}>
              <span className={style.countItemIconBox5}><FontAwesomeIcon icon={faPenToSquare} className={style.countItemIcon}/></span><br/>
              <span className={style.countItemText5}>{this.state.countAll.requests}</span><span> Yêu cầu</span>
            </MDBCol>
            <MDBCol className={style.countItem}>
              <span className={style.countItemIconBox6}><FontAwesomeIcon icon={faBook} className={style.countItemIcon}/></span><br/>
              <span className={style.countItemText6}>{this.state.countAll.blogs}</span><span> Bài blog</span>
            </MDBCol>
          </MDBRow>
        </MDBCard><br/>
        <MDBCard className={style.allCountBox}>
          <h4><b>Các địa điểm nổi tiếng nhất</b></h4>
          <MDBRow>
            {topPOIBox}
          </MDBRow>
        </MDBCard>
        <MDBRow>
          <MDBCol>
            <MDBCard className={style.byDateBox}>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol>
                    <MDBInput type="date" onChange={this.handleTripChange} id="tripStart"/>
                  </MDBCol>
                  <MDBCol>
                    <MDBInput type="date" onChange={this.handleTripChange} id="tripEnd"/>
                  </MDBCol>
                </MDBRow>
                <Line options={this.tripOptions} data={tripData}/>
              </MDBCardBody>
            </MDBCard>
            <MDBCard className={style.byDateBox}>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol>
                    <MDBInput type="date" onChange={this.handleUserChange} id="userStart"/>
                  </MDBCol>
                  <MDBCol>
                    <MDBInput type="date" onChange={this.handleUserChange} id="userEnd"/>
                  </MDBCol>
                </MDBRow>
                {userChart}
              </MDBCardBody>
            </MDBCard>
            <MDBCard className={style.byDateBox}>
              <MDBCardBody className={style.allCountBox}>
                <h4>Thống kê địa điểm</h4>
                <MDBRow>
                  <MDBCol>
                    <span className={style.countItemIconBox7}><FontAwesomeIcon icon={faPlaceOfWorship} className={style.countItemIcon}/></span><br/>
                    <span className={style.countItemText7}>{this.state.poiCount}</span><span> Địa điểm</span>
                  </MDBCol>
                  <MDBCol>
                    <span className={style.countItemIconBox8}><FontAwesomeIcon icon={faHotel} className={style.countItemIcon}/></span><br/>
                    <span className={style.countItemText8}>{this.state.hotelCount}</span><span> Khách sạn</span>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol>
            <MDBCard className={style.ratingBox}>
              <MDBCardBody>
                <Pie options={this.ratingOptions} data={ratingData}/>
                <b>Địa điểm đánh giá cao nhất</b>
                {topRatingBox}
                <b>Địa điểm đánh giá nhiều nhất</b>
                {topCountRatingBox}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    )
  }
}
export default Dashboard;
