import React from "react";
import ReactDOM from "react-dom";
import { useState, useRef, useMemo  } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import Rating from "../../components/POIs/Rating";
import { Component } from 'react';
import { convertToRaw, EditorState, ContentState, convertFromHTML } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtmlPuri from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "../../api/axios";
import Dropdown from 'react-bootstrap/Dropdown';
import AddPOIImageModal from "../../components/Admin/AddPOIImageModal";
import { Modal } from "antd";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBIcon,
  MDBTextArea
} from "mdb-react-ui-kit";
import {
  faAngleRight, faCirclePlus, faClock, faClose, faCross, faDoorClosed, faDoorOpen, faMoneyBill, faPhone, faSquarePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./POIAddUpdate.module.css";
const { confirm } = Modal;
class POIAddUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      poi: {},
      images: [],
      dataLoaded: false,
      destinations: [],
    };
  }
  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    
    if (id > 0) {
      axios.get(`http://localhost:8080/api/destination/all`).then((res) => {
        const data = res.data;
        this.setState({
          destinations: data,
        });
      }).catch(
        function (error) {
          console.log(error)
          return Promise.reject(error)
        }
      );
      axios.get(`http://localhost:8080/api/pois/list/admin/update/` + id).then((res) => {
        const data = res.data;
        this.setState({
          poi: data,
        });
      }).catch(
        function (error) {
          console.log(error)
          return Promise.reject(error)
        }
      );
      axios.get(`http://localhost:8080/api/pois/list/admin/update/images/` + id).then((res) => {
        const data = res.data;
        this.setState({
          images: data,
          dataLoaded: true,
        });
      }).catch(
        function (error) {
          console.log(error)
          return Promise.reject(error)
        }
      );
    }
  }
  
  reloadImgs() {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    
    if (id > 0) {
      axios.get(`http://localhost:8080/api/pois/list/admin/update/images/` + id).then((res) => {
        const data = res.data;
        this.setState({
          images: data,
          dataLoaded: true,
        });
      }).catch(
        function (error) {
          console.log(error)
          return Promise.reject(error)
        }
      );
    }
  }

  filterChanged = async (event) => {
    const filterDropdown = document.getElementById("filterDropdown");
    filterDropdown.innerHTML = event.currentTarget.name;
    filterDropdown.name = event.currentTarget.id;
  }

  updateClick = async (event) => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    var validated = true;
    if (document.getElementById("nameInput").value == null || document.getElementById("nameInput").value == "" ||
          document.getElementById("addressInput").value == null || document.getElementById("addressInput").value == "" ||
          document.getElementById("descInput").value == null || document.getElementById("descInput").value == "" ||
          document.getElementById("durationInput").value == null || document.getElementById("durationInput").value == "" ||
          document.getElementById("priceInput").value == null || document.getElementById("priceInput").value == "" ||
          document.getElementById("closeInput").value == null || document.getElementById("closeInput").value == "" ||
          document.getElementById("openInput").value == null || document.getElementById("openInput").value == "" ||
          document.getElementById("filterDropdown").name == "category")
        validated = false;
    if (id > 0) {
      if (validated) {
        var hms = document.getElementById("closeInput").value;   // your input string
        var a = hms.split(':'); // split it at the colons
        var close = (+a[0]) * 60 * 60 + (+a[1]) * 60; 
        var hms = document.getElementById("openInput").value;   // your input string
        var a = hms.split(':'); // split it at the colons
        var open = (+a[0]) * 60 * 60 + (+a[1]) * 60; 
        var dura = document.getElementById("durationInput").value * 60 * 60;
        axios({
          method: "post",
          url: "http://localhost:8080/api/pois/update",
          data: {
            activityId: id,
            address: document.getElementById("addressInput").value,
            name: document.getElementById("nameInput").value,
            description: document.getElementById("descInput").value,
            additionalInfo: document.getElementById("infoInput").value,
            email: document.getElementById("emailInput").value,
            closingTime: close,
            openingTime: open,
            duration: dura,
            phoneNumber: document.getElementById("phoneInput").value,
            price: document.getElementById("priceInput").value,
            website: document.getElementById("webInput").value,
            categoryId: document.getElementById("filterDropdown").name
          },
          headers: {
            "Content-Type": "application/json",
          },
        }).then(function (response) {
          window.location.href = "../poi?id=" + id;
        });
      }
      else
        document.getElementById("errorMessage").innerHTML =
          "Hãy nhập hết dữ liệu cần thiết.";
    } else {
      if (validated) {
        var hms = document.getElementById("closeInput").value;   // your input string
        var a = hms.split(':'); // split it at the colons
        var close = (+a[0]) * 60 * 60 + (+a[1]) * 60; 
        var hms = document.getElementById("openInput").value;   // your input string
        var a = hms.split(':'); // split it at the colons
        var open = (+a[0]) * 60 * 60 + (+a[1]) * 60; 
        var dura = document.getElementById("durationInput").value * 60 * 60;
        axios({
          method: "post",
          url: "http://localhost:8080/api/pois/add",
          data: {
            address: document.getElementById("addressInput").value,
            name: document.getElementById("nameInput").value,
            description: document.getElementById("descInput").value,
            additionalInfo: document.getElementById("infoInput").value,
            email: document.getElementById("emailInput").value,
            closingTime: close,
            openingTime: open,
            duration: dura,
            phoneNumber: document.getElementById("phoneInput").value,
            price: document.getElementById("priceInput").value,
            website: document.getElementById("webInput").value,
            categoryId: document.getElementById("filterDropdown").name
          },
          headers: {
            "Content-Type": "application/json",
          },
        }).then(function (response) {
          window.location.href = "../poi?id=" + response.data;
        });
      }
      else
        document.getElementById("errorMessage").innerHTML =
          "Hãy nhập hết dữ liệu cần thiết.";
    }
  }

  deleteImage = async (event) => {
    const imgId = event.currentTarget.id;
    confirm({
      title: "Bạn có chắc mình muốn xóa ảnh địa điểm này không?",
      content: "Ảnh sẽ bị xóa",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        await axios.post(`http://localhost:8080/api/pois/deleteImg/` + imgId, {});
        this.reloadImgs();
      },
      onCancel() {},
    });
  }

  render() {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    const imageBox = [];
    const onTextAreaInput = (e) => {
      e.currentTarget.style.height = "5px";
      e.currentTarget.style.height = (e.currentTarget.scrollHeight)+"px";
    }
    //Add or Update elements
    const submitBtn = [];
    if (id > 0)
      submitBtn.push(
        <div className={style.btnBoxUpdate}>
          <span className={style.warningBox}><i>Chỉ cập nhật thông tin của địa điểm, ảnh sẽ được cập nhật tự động</i></span>
          <MDBBtn className={style.updateBtn} onClick={this.updateClick}>Cập nhật thông tin</MDBBtn>
        </div>)
    else 
      submitBtn.push(
      <div className={style.btnBoxUpdate}>
        <MDBBtn className={style.updateBtn} onClick={this.updateClick}>Thêm địa điểm</MDBBtn>
      </div>)
    const navItem = [];
    if (id > 0)
      navItem.push(<b>Chỉnh sửa địa điểm</b>);
    else
      navItem.push(<b>Thêm địa điểm</b>);
    const headerText = [];
    if (id > 0)
      headerText.push(<h2 style={{'textAlign':'center'}}>Cập nhật Địa điểm</h2>);
    else
      headerText.push(<h2 style={{'textAlign':'center'}}>Thêm Địa điểm</h2>);
    const imageAddBtn = [];
    if (id > 0)
      imageAddBtn.push(
        <AddPOIImageModal refreshHandler={() => this.reloadImgs()}/>
      )
    const warningBox = [];
    if (id > 0)
      warningBox.push(<span style={{'textAlign':'center'}} className={style.warningBox}><i>Ảnh được cập nhật tự động ngay sau khi thêm hoặc xóa</i></span>);
    else
      warningBox.push(<span style={{'textAlign':'center'}} className={style.warningBox}><i>Ảnh chỉ có thể được thêm vào sau khi lưu địa điểm</i></span>);
    //Set initial content
    if (this.state.dataLoaded){
      document.getElementById("nameInput").value = this.state.poi.name;
      document.getElementById("nameInput").classList.add("active");
      document.getElementById("addressInput").value = this.state.poi.address;
      document.getElementById("addressInput").classList.add("active");
      document.getElementById("descInput").value = this.state.poi.description;
      document.getElementById("descInput").classList.add("active");
      document.getElementById("infoInput").value = this.state.poi.additionalInfo;
      document.getElementById("infoInput").classList.add("active");
      document.getElementById("webInput").value = this.state.poi.website;
      document.getElementById("webInput").classList.add("active");
      document.getElementById("phoneInput").value = this.state.poi.phoneNumber;
      document.getElementById("phoneInput").classList.add("active");
      document.getElementById("emailInput").value = this.state.poi.email;
      document.getElementById("emailInput").classList.add("active");
      document.getElementById("priceInput").value = this.state.poi.price;
      document.getElementById("priceInput").classList.add("active");
      const duration = this.state.poi.duration/60/60;
      document.getElementById("durationInput").value = duration;
      document.getElementById("durationInput").classList.add("active");
      //Opening Time
      var sec_num = parseInt(this.state.poi.openingTime, 10);
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      var openTime =  hours+':'+minutes+':'+seconds;
      document.getElementById("openInput").value = openTime;
      //Closing Time
      var sec_num = parseInt(this.state.poi.closingTime, 10);
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      var closeTime =  hours+':'+minutes+':'+seconds;
      document.getElementById("closeInput").value = closeTime;

      const filterDropdown = document.getElementById("filterDropdown");
      filterDropdown.innerHTML = this.state.poi.categoryName;
      filterDropdown.name = this.state.poi.categoryId;
      //Change height of textboxes
      document.getElementById("nameInput").style.height = (document.getElementById("nameInput").scrollHeight)+"px";
      document.getElementById("descInput").style.height = (document.getElementById("descInput").scrollHeight)+"px";
      document.getElementById("addressInput").style.height = (document.getElementById("addressInput").scrollHeight)+"px";
      document.getElementById("infoInput").style.height = (document.getElementById("infoInput").scrollHeight)+"px";
      if (this.state.images.length > 0)
        this.state.images.forEach((entry, index) => {
          let imgLink = entry.url;
          const imgArr = imgLink.split("/");
          if (imgArr[0] == "img")
            imgLink = "../" + imgLink;
          imageBox.push(
            <MDBCard className={style.imageBox}>
              <img className={style.poiImage} title={entry.description} src={imgLink}/>
              <div className={style.imageContent}>
                {entry.description}<br/>
                <a className={style.deleteIcon} id={entry.imageId} onClick={this.deleteImage}><FontAwesomeIcon icon={faClose}/></a>
              </div>
            </MDBCard>
          )
        });
    }
    return (
      <MDBContainer className={style.mainContainer}>
        <div className={style.nav}>
          <a className={style.navItem} href="./adminlist"><b>Quản lí địa điểm</b></a><FontAwesomeIcon className={style.arrowIcon} icon={faAngleRight}/>{navItem}
        </div>
        {headerText}
        {submitBtn}
        <div id="errorMessage" className={style.errorMessage}></div>
        <MDBTextArea
          label="Tên"
          id="nameInput"
          type="text"
          maxLength="100"
          placeholder="Thêm tên cho địa điểm"
          className={style.textInputs}
          onChange={onTextAreaInput}
          rows={1}
        />
        <MDBTextArea
          label="Địa chỉ"
          id="addressInput"
          type="text"
          maxLength="300"
          placeholder="Thêm địa chỉ"
          className={style.textInputs}
          onChange={onTextAreaInput}
          rows={1}
        />
        <MDBTextArea
          label="Mô tả"
          id="descInput"
          type="text"
          maxLength="4000"
          placeholder="Thêm mô tả"
          className={style.textInputs}
          onChange={onTextAreaInput}
          rows={7}
        />
        <MDBTextArea
          label="Thông tin thêm"
          id="infoInput"
          type="text"
          maxLength="1000"
          placeholder="Thêm thông tin"
          className={style.textInputs}
          onChange={onTextAreaInput}
          rows={1}
        />
        <MDBInput
          label="Trang web"
          id="webInput"
          type="text"
          maxLength="500"
          placeholder="Thêm trang web"
          className={style.textInputs}
        />
        <MDBRow>
          <MDBCol md={4}>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <MDBInput
                label="Điện thoại"
                id="phoneInput"
                type="tel"
                maxLength="20"
                placeholder="Thêm số điện thoại"
                className="form-control"
              />
            </div>
          </MDBCol>
          <MDBCol md={8}>
            <MDBInput
              label="Email"
              id="emailInput"
              type="text"
              maxLength="100"
              placeholder="Thêm email liên lạc"
              className={style.textInputs}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <label>Khoảng thời gian</label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faClock} />
              </span>
              <MDBInput
                id="durationInput"
                type="number"
                maxLength="15"
                placeholder="Thêm khoảng thời gian"
                className="form-control"
              />
              <span className="input-group-text">
                tiếng
              </span>
            </div>
          </MDBCol>
          <MDBCol>
            <label>Giờ mở cửa</label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faDoorOpen} />
              </span>
              <MDBInput
                id="openInput"
                type="time"
                className="form-control"
              />
            </div>
          </MDBCol>
          <MDBCol>
            <label>Giờ đóng cửa</label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faDoorClosed} />
              </span>
              <MDBInput
                id="closeInput"
                type="time"
                className="form-control"
              />
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <label>Giá trung bình</label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faMoneyBill} />
              </span>
              <MDBInput
                id="priceInput"
                type="number"
                maxLength="20"
                placeholder="Thêm giá tiền"
                className="form-control"
              />
              <span className="input-group-text">
                đồng
              </span>
            </div>
          </MDBCol>
          <MDBCol>
            <label>Danh mục</label>
            <Dropdown>
              <Dropdown.Toggle variant="info">
                <span id="filterDropdown" name="category"> Chọn danh mục</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={this.filterChanged} id={1} name="Văn hóa, nghệ thuật">Văn hóa, nghệ thuật</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={2} name="Hoạt động ngoài trời">Hoạt động ngoài trời</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={3} name="Tôn giáo">Tôn giáo</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={4} name="Lịch sử">Lịch sử</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={5} name="Bảo tàng">Bảo tàng</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={6} name="Spa & Sức khỏe">Spa & Sức khỏe</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={7} name="Mua sắm">Mua sắm</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={8} name="Bãi biển">Bãi biển</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={9} name="Hoạt động đêm">Hoạt động đêm</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={10} name="Khách sạn">Khách sạn</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={11} name="Nhà hàng">Nhà hàng</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={12} name="Vui chơi giải trí">Vui chơi giải trí</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </MDBCol>
          <MDBCol>
            <label>Đánh giá từ Google</label><br/>
            <Rating ratings={this.state.poi.rating}/><br/>
            <span className={style.warningBox}><i>Đánh giá được lấy từ Google</i></span>
          </MDBCol>
        </MDBRow>
        <br/><br/>
        <h3 style={{'textAlign':'center'}}>Ảnh Địa điểm<br/>
          {warningBox}
        </h3>
        <div className={style.imageGroup}>
          {imageBox}<br/>
          {imageAddBtn}
        </div>
      </MDBContainer>
    )
  }
}
export default POIAddUpdate;
