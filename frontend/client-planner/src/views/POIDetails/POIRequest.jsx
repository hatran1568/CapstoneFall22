import React from "react";
import ReactDOM from "react-dom";
import { useState, useRef, useMemo } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import validator from "validator";
import Rating from "../../components/POIs/Rating";
import { Component } from "react";
import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromHTML,
} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import draftToHtmlPuri from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "../../api/axios";
import Dropdown from "react-bootstrap/Dropdown";
import { MultiSelect } from "react-multi-select-component";
import Select from "react-select";
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
  MDBTextArea,
} from "mdb-react-ui-kit";
import {
  faAngleRight,
  faCirclePlus,
  faClock,
  faClose,
  faCross,
  faDoorClosed,
  faDoorOpen,
  faMoneyBill,
  faPhone,
  faRulerHorizontal,
  faRulerVertical,
  faSquarePlus,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./POIRequest.module.css";
const { confirm } = Modal;
class POIRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      poi: {},
      dataLoaded: false,
      desDataLoaded: false,
      newImages: [],
    };
  }
  componentDidMount() {
    document.title = "Yêu cầu chỉnh sửa thông tin địa điểm | Tripplanner";
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    if (id > 0) {
      axios
        .get(
          `http://localhost:8080/location/api/pois/list/admin/update/` + id,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )
        .then((res) => {
          const data = res.data;
          this.setState({
            poi: data,
            dataLoaded: true,
          });
        })
        .catch(function (error) {
          console.log(error);
          return Promise.reject(error);
        });
    } else
      this.setState({
        dataLoaded: true,
      });
  }

  delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  updateClick = async (event) => {
    const queryParams = new URLSearchParams(window.location.search);
    var id = queryParams.get("id");
    var validated = true;
    if (
      document.getElementById("nameInput").value == null ||
      document.getElementById("nameInput").value == ""
    ) {
      validated = false;
      document.getElementById("errorMessage").innerHTML =
        "Hãy nhập tên của địa điểm.";
    }
    if (
      document.getElementById("addressInput").value == null ||
      document.getElementById("addressInput").value == ""
    ) {
      validated = false;
      document.getElementById("errorMessage").innerHTML =
        "Hãy nhập địa chỉ của địa điểm.";
    }
    if (
      document.getElementById("descInput").value == null ||
      document.getElementById("descInput").value == ""
    ) {
      validated = false;
      document.getElementById("errorMessage").innerHTML =
        "Hãy nhập mô tả của địa điểm.";
    }
    if (
      document.getElementById("durationInput").value == null ||
      document.getElementById("durationInput").value == ""
    ) {
      validated = false;
      document.getElementById("errorMessage").innerHTML =
        "Hãy nhập khoảng thời gian của địa điểm.";
    }
    if (
      document.getElementById("priceInput").value == null ||
      document.getElementById("priceInput").value == ""
    ) {
      validated = false;
      document.getElementById("errorMessage").innerHTML =
        "Hãy nhập giá trung bình của địa điểm.";
    }
    if (
      document.getElementById("closeInput").value == null ||
      document.getElementById("closeInput").value == ""
    ) {
      validated = false;
      document.getElementById("errorMessage").innerHTML =
        "Hãy nhập thời gian đóng cửa của địa điểm.";
    }
    if (
      document.getElementById("openInput").value == null ||
      document.getElementById("openInput").value == ""
    ) {
      validated = false;
      document.getElementById("errorMessage").innerHTML =
        "Hãy nhập thời gian mở cửa của địa điểm.";
    }
    if (
      document.getElementById("emailInput").value == null ||
      document.getElementById("emailInput").value == ""
    ) {
    } else if (
      !validator.isEmail(document.getElementById("emailInput").value)
    ) {
      validated = false;
      document.getElementById("errorMessage").innerHTML =
        "Hãy nhập đúng email.";
    }
    if (validated) {
      const loadingIcon = document.getElementById("loadingIcon");
      loadingIcon.style.display = "inline";
      var hms = document.getElementById("closeInput").value; // your input string
      var a = hms.split(":"); // split it at the colons
      var close = +a[0] * 60 * 60 + +a[1] * 60;
      var hms = document.getElementById("openInput").value; // your input string
      var a = hms.split(":"); // split it at the colons
      var open = +a[0] * 60 * 60 + +a[1] * 60;
      var dura = document.getElementById("durationInput").value * 60 * 60;
      var images = this.state.newImages;
      //console.log(images);
      await axios({
        method: "post",
        url: "http://localhost:8080/location/api/request/new",
        data: {
          poiId: id,
          userId: localStorage.getItem("id"),
          address: document.getElementById("addressInput").value,
          name: document.getElementById("nameInput").value,
          description: document.getElementById("descInput").value,
          additionalInfo: document.getElementById("infoInput").value,
          email: document.getElementById("emailInput").value,
          close: close,
          open: open,
          duration: dura,
          phoneNumber: document.getElementById("phoneInput").value,
          price: document.getElementById("priceInput").value,
          website: document.getElementById("webInput").value,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        id = response.data;
        images.forEach((entry, index) => {
          const formData = new FormData();
          formData.append("File", entry);
          axios
            .post(
              `http://localhost:8080/location/api/request/reqImg/` + id,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "multipart/form-data",
                },
              },
            )
            .then(function (response) {});
        });
      });
      await this.delay(3000);
      const queryParams = new URLSearchParams(window.location.search);
      id = queryParams.get("id");
      //window.location.href = "/poi?id=" + id;
    }
  };

  deleteImage = async (event) => {
    const imgId = event.currentTarget.id;
    confirm({
      title: "Bạn có chắc mình muốn xóa ảnh địa điểm này không?",
      content: "Ảnh sẽ bị xóa",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        var currentImg = this.state.images;
        var deleted = this.state.deletedImages;
        currentImg.forEach((entry, index) => {
          if (entry.imageId == imgId) {
            currentImg.splice(index, 1);
            deleted.push(imgId);
          }
          this.setState({
            images: currentImg,
            deletedImages: deleted,
          });
        });
      },
      onCancel() {},
    });
  };

  deleteNewImage = async (event) => {
    const imgId = event.currentTarget.id;
    confirm({
      title: "Bạn có chắc mình muốn xóa ảnh địa điểm này không?",
      content: "Ảnh sẽ bị xóa",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        var newImgs = this.state.newImages;
        newImgs.splice(imgId, 1);
        this.setState({
          newImages: newImgs,
        });
      },
      onCancel() {},
    });
  };

  setNewImages = async (event) => {
    if (document.getElementById("fileInput").files[0] != null) {
      const currentNewImgs = this.state.newImages;
      const files = document.getElementById("fileInput").files;
      const imgs = Array.from(files);
      imgs.forEach((entry, index) => {
        currentNewImgs.push(entry);
      });
      this.setState({
        newImages: currentNewImgs,
      });
      // console.log(files);
      // console.log(imgs);
      // console.log(this.state.newImages);
    }
  };

  render() {
    const handleClick = (e) => {
      document.getElementById("fileInput").click();
    };
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    const imageBox = [];
    const onTextAreaInput = (e) => {
      e.currentTarget.style.height = "5px";
      e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
    };
    //Add or Update elements
    const submitBtn = [];
    submitBtn.push(
      <div className={style.btnBoxUpdate}>
        <img
          id="loadingIcon"
          style={{ display: "none" }}
          src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif?20170503175831"
          width="50"
        />
        <MDBBtn className={style.updateBtn} onClick={this.updateClick}>
          Thêm yêu cầu
        </MDBBtn>
      </div>,
    );
    const headerText = [];
    headerText.push(
      <h2 style={{ textAlign: "center" }}>Yêu cầu cập nhật Địa điểm</h2>,
    );
    const imageAddBtn = [];
    imageAddBtn.push(
      <MDBContainer>
        <MDBCard className={style.imageAddBox} onClick={handleClick}>
          <FontAwesomeIcon className={style.addIcon} icon={faCirclePlus} />
        </MDBCard>
        <MDBInput
          type="file"
          id="fileInput"
          accept=".jpg,.jpeg,.png"
          onChange={this.setNewImages}
          multiple
          hidden
        />
      </MDBContainer>,
    );
    //Set initial content
    if (this.state.dataLoaded) {
      if (id > 0) {
        document.getElementById("nameInput").value = this.state.poi.name;
        document.getElementById("addressInput").value = this.state.poi.address;
        document.getElementById("descInput").value = this.state.poi.description;
        document.getElementById("infoInput").value =
          this.state.poi.additionalInfo;
        document.getElementById("webInput").value = this.state.poi.website;
        document.getElementById("phoneInput").value =
          this.state.poi.phoneNumber;
        document.getElementById("emailInput").value = this.state.poi.email;
        document.getElementById("priceInput").value = this.state.poi.price;
        const duration = this.state.poi.duration / 60 / 60;
        document.getElementById("durationInput").value = duration;
        //Opening Time
        var sec_num = parseInt(this.state.poi.openingTime, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - hours * 3600) / 60);
        var seconds = sec_num - hours * 3600 - minutes * 60;

        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        var openTime = hours + ":" + minutes + ":" + seconds;
        document.getElementById("openInput").value = openTime;
        //Closing Time
        var sec_num = parseInt(this.state.poi.closingTime, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - hours * 3600) / 60);
        var seconds = sec_num - hours * 3600 - minutes * 60;

        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        var closeTime = hours + ":" + minutes + ":" + seconds;
        document.getElementById("closeInput").value = closeTime;

        //Change height of textboxes
        document.getElementById("nameInput").style.height =
          document.getElementById("nameInput").scrollHeight + "px";
        document.getElementById("descInput").style.height =
          document.getElementById("descInput").scrollHeight + "px";
        document.getElementById("addressInput").style.height =
          document.getElementById("addressInput").scrollHeight + "px";
        document.getElementById("infoInput").style.height =
          document.getElementById("infoInput").scrollHeight + "px";
      }
    }

    if (this.state.newImages.length > 0) {
      this.state.newImages.forEach((entry, index) => {
        let imgLink = URL.createObjectURL(entry);
        imageBox.push(
          <MDBCard className={style.imageBox}>
            <img
              className={style.poiImage}
              title={entry.description}
              src={imgLink}
            />
            <div className={style.imageContent}>
              {entry.description}
              <br />
              <a
                className={style.deleteIcon}
                id={index}
                onClick={this.deleteNewImage}
              >
                <FontAwesomeIcon icon={faClose} />
              </a>
            </div>
          </MDBCard>,
        );
      });
    }
    const requiredStar = [];
    requiredStar.push(<b className={style.requiredStar}>*</b>);

    return (
      <MDBContainer className={style.mainContainer}>
        {headerText}
        {submitBtn}
        <div id="errorMessage" className={style.errorMessage}></div>
        <label>
          <b>Tên</b>
          {requiredStar}
        </label>
        <MDBTextArea
          id="nameInput"
          type="text"
          maxLength="100"
          placeholder="Thêm tên cho địa điểm"
          className={style.textInputs}
          onChange={onTextAreaInput}
          rows={1}
        />
        <label>
          <b>Địa chỉ</b>
          {requiredStar}
        </label>
        <MDBTextArea
          id="addressInput"
          type="text"
          maxLength="300"
          placeholder="Thêm địa chỉ"
          className={style.textInputs}
          onChange={onTextAreaInput}
          rows={1}
        />
        <label>
          <b>Mô tả</b>
          {requiredStar}
        </label>
        <MDBTextArea
          id="descInput"
          type="text"
          maxLength="4000"
          placeholder="Thêm mô tả"
          className={style.textInputs}
          onChange={onTextAreaInput}
          rows={7}
        />
        <label>
          <b>Thông tin thêm</b>
        </label>
        <MDBTextArea
          id="infoInput"
          type="text"
          maxLength="1000"
          placeholder="Thêm thông tin"
          className={style.textInputs}
          onChange={onTextAreaInput}
          rows={1}
        />
        <label>
          <b>Trang web</b>
        </label>
        <MDBInput
          id="webInput"
          type="text"
          maxLength="500"
          placeholder="Thêm trang web"
          className={style.textInputs}
        />
        <MDBRow>
          <MDBCol md={4}>
            <label>
              <b>Điện thoại</b>
            </label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <MDBInput
                id="phoneInput"
                type="tel"
                maxLength="20"
                placeholder="Thêm số điện thoại"
                className="form-control"
              />
            </div>
          </MDBCol>
          <MDBCol md={8}>
            <label>
              <b>Email</b>
            </label>
            <MDBInput
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
            <label>
              <b>Khoảng thời gian</b>
              {requiredStar}
            </label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faClock} />
              </span>
              <MDBInput
                id="durationInput"
                type="text"
                pattern="\d*"
                maxLength="2"
                placeholder="Thêm khoảng thời gian"
                className="form-control"
              />
              <span className="input-group-text">tiếng</span>
            </div>
          </MDBCol>
          <MDBCol>
            <label>
              <b>Giờ mở cửa</b>
              {requiredStar}
            </label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faDoorOpen} />
              </span>
              <MDBInput id="openInput" type="time" className="form-control" />
            </div>
          </MDBCol>
          <MDBCol>
            <label>
              <b>Giờ đóng cửa</b>
              {requiredStar}
            </label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faDoorClosed} />
              </span>
              <MDBInput id="closeInput" type="time" className="form-control" />
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <label>
              <b>Giá trung bình</b>
              {requiredStar}
            </label>
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faMoneyBill} />
              </span>
              <MDBInput
                id="priceInput"
                type="text"
                pattern="\d*"
                maxLength="20"
                placeholder="Thêm giá tiền"
                className="form-control"
              />
              <span className="input-group-text">đồng</span>
            </div>
          </MDBCol>
        </MDBRow>
        <br />
        <br />
        <h3 style={{ textAlign: "center" }}>
          Ảnh Địa điểm
          <br />
        </h3>
        <div className={style.imageGroup}>
          {imageBox}
          <br />
          {imageAddBtn}
        </div>
      </MDBContainer>
    );
  }
}
export default POIRequest;
