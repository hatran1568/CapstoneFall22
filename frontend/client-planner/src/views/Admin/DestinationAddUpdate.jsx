import React from "react";
import ReactDOM from "react-dom";
import { useState, useRef, useMemo } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
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
import style from "./POIAddUpdate.module.css";
const { confirm } = Modal;
class DestinationAddUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      destination: {},
      images: [],
      dataLoaded: false,
      desDataLoaded: false,
      destinations: [],
      selectedDestinations: [],
      destinationChanged: false,
      newImages: [],
      deletedImages: [],
    };
  }
  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");
    if (id > 0)
      document.title = "Chỉnh sửa điểm đến | Tripplanner"
    else
      document.title = "Thêm điểm đến";
    axios
      .get(`http://localhost:8080/location/api/destination/select/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const data = res.data;
        this.setState({
          destinations: data,
          desDataLoaded: true,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
    if (id > 0) {
      axios
        .get(
          `http://localhost:8080/location/api/destination/admin/list/update/` +
            id,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          const data = res.data;
          this.setState({
            destination: data,
          });
        })
        .catch(function (error) {
          console.log(error);
          return Promise.reject(error);
        });
      axios
        .get(
          `http://localhost:8080/location/api/destination/admin/list/update/images/` +
            id,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          const data = res.data;
          this.setState({
            images: data,
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
  reloadImgs() {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");

    if (id > 0) {
      axios
        .get(
          `http://localhost:8080/location/api/destination/admin/list/update/images/` +
            id,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          const data = res.data;
          this.setState({
            images: data,
            dataLoaded: true,
          });
        })
        .catch(function (error) {
          console.log(error);
          return Promise.reject(error);
        });
    }
  }

  filterChanged = async (event) => {
    const filterDropdown = document.getElementById("filterDropdown");
    filterDropdown.innerHTML = event.currentTarget.name;
    filterDropdown.name = event.currentTarget.id;
  };

  desChanged = async (event) => {
    var items = event.options;
    console.log(items);
    // this.setState({
    //   selectedDestinations: event.currentTarget
    // })
  };

  delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  updateClick = async (event) => {
    const queryParams = new URLSearchParams(window.location.search);
    var id = queryParams.get("id");
    var curDes = this.state.currentDestinations;
    var validated = true;
    if (
      document.getElementById("nameInput").value == null ||
      document.getElementById("nameInput").value == "") {
        validated = false;
        document.getElementById("errorMessage").innerHTML =
          "Hãy nhập tên của điểm đến.";
      }
    if (
      document.getElementById("descInput").value == null ||
      document.getElementById("descInput").value == "") {
        validated = false;
        document.getElementById("errorMessage").innerHTML =
          "Hãy nhập mô tả của điểm đến.";
      }
    if (id != 0 && curDes == null && this.state.destinationChanged == true) {
      validated = false;
      document.getElementById("errorMessage").innerHTML =
      "Hãy chọn thuộc điểm đến.";
    }
    if (id == 0 && curDes == null) {
      validated = false;
      document.getElementById("errorMessage").innerHTML =
      "Hãy chọn thuộc điểm đến.";
    }
    // console.log(document.getElementById("nameInput").value);
    // console.log(document.getElementById("addressInput").value);
    // console.log(document.getElementById("descInput").value);
    // console.log(document.getElementById("durationInput").value);
    // console.log(document.getElementById("priceInput").value);
    // console.log(document.getElementById("closeInput").value);
    // console.log(document.getElementById("openInput").value);
    // console.log(document.getElementById("rateInput").value);
    // console.log(document.getElementById("latInput").value);
    // console.log(document.getElementById("lonInput").value);
    // console.log(document.getElementById("filterDropdown").name);
    if (id > 0) {
      if (validated) {
        const loadingIcon = document.getElementById("loadingIcon");
        loadingIcon.style.display = "inline";
        var images = this.state.newImages;
        var belong = this.state.destination.belongId;
        if (this.state.destinationChanged)
          belong = this.state.currentDestinations["value"];
        //console.log(belong);

        await axios({
          method: "post",
          url: "http://localhost:8080/location/api/destination/update",
          data: {
            desId: id,
            name: document.getElementById("nameInput").value,
            description: document.getElementById("descInput").value,
            belongTo: belong,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        await this.state.deletedImages.forEach((entry, index) => {
          axios.post(
            `http://localhost:8080/location/api/destination/deleteImg/` + entry
          );
        });
        await this.state.newImages.forEach((entry, index) => {
          const formData = new FormData();
          formData.append("File", entry);
          var desc = "*";
          axios
            .post(
              `http://localhost:8080/location/api/destination/addImg/` +
                id +
                "/" +
                desc,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then(function (response) {});
        });
        await this.delay(3000);
        window.location.href = "../destination/adminlist";
      }
    } else {
      if (validated) {
        const loadingIcon = document.getElementById("loadingIcon");
        loadingIcon.style.display = "inline";
        var images = this.state.newImages;
        var belong;
        if (this.state.destinationChanged)
          belong = this.state.currentDestinations["value"];
        //console.log(images);
        await axios({
          method: "post",
          url: "http://localhost:8080/location/api/destination/add",
          data: {
            desId: id,
            name: document.getElementById("nameInput").value,
            description: document.getElementById("descInput").value,
            belongTo: belong,
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
            var desc = "*";
            axios
              .post(
                `http://localhost:8080/location/api/destination/addImg/` +
                  id +
                  "/" +
                  desc,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
              .then(function (response) {});
          });
          if (curDes != null) {
            const desData = curDes;
            axios({
              method: "post",
              url:
                "http://localhost:8080/location/api/destination/update/" + id,
              data: desData,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
          }
        });
        await this.delay(3000);
        window.location.href = "../destination/update?id=" + id;
      }
    }
  };

  deleteImage = async (event) => {
    const imgId = event.currentTarget.id;
    confirm({
      title: "Bạn có chắc mình muốn xóa ảnh điểm đến này không?",
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
      title: "Bạn có chắc mình muốn xóa ảnh điểm đến này không?",
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
    if (id > 0)
      submitBtn.push(
        <div className={style.btnBoxUpdate}>
          <img
            id="loadingIcon"
            style={{ display: "none" }}
            src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif?20170503175831"
            width="50"
          />
          <MDBBtn className={style.updateBtn} onClick={this.updateClick}>
            Cập nhật thông tin
          </MDBBtn>
        </div>
      );
    else
      submitBtn.push(
        <div className={style.btnBoxUpdate}>
          <img
            id="loadingIcon"
            style={{ display: "none" }}
            src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif?20170503175831"
            width="50"
          />
          <MDBBtn className={style.updateBtn} onClick={this.updateClick}>
            Thêm điểm đến
          </MDBBtn>
        </div>
      );
    const navItem = [];
    if (id > 0) navItem.push(<b>Chỉnh sửa điểm đến</b>);
    else navItem.push(<b>Thêm điểm đến</b>);
    const headerText = [];
    if (id > 0)
      headerText.push(
        <h2 style={{ textAlign: "center" }}>Cập nhật Điểm đến</h2>
      );
    else
      headerText.push(<h2 style={{ textAlign: "center" }}>Thêm Điểm đến</h2>);
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
      </MDBContainer>
    );
    //Set initial content
    const selectDestination = [];
    const defaultDes = {
      value: this.state.destination.belongId,
      label: this.state.destination.belongName,
    };
    if (this.state.dataLoaded && this.state.desDataLoaded) {
      selectDestination.push(
        <Select
          defaultValue={defaultDes}
          id="desSelect"
          onChange={async (value) => {
            const v = value;
            await this.setState({
              currentDestinations: v,
              destinationChanged: true,
            });
          }}
          options={this.state.destinations}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Chọn điểm đến trực thuộc"
        />
      );
      if (id > 0) {
        document.getElementById("nameInput").value =
          this.state.destination.name;
        document.getElementById("descInput").value =
          this.state.destination.description;

        //Change height of textboxes
        document.getElementById("nameInput").style.height =
          document.getElementById("nameInput").scrollHeight + "px";
        document.getElementById("descInput").style.height =
          document.getElementById("descInput").scrollHeight + "px";
        if (this.state.images.length > 0) {
          this.state.images.forEach((entry, index) => {
            let imgLink = entry.url;
            const imgArr = imgLink.split("/");
            if (imgArr[0] == "img") imgLink = "../" + imgLink;
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
                    id={entry.imageId}
                    onClick={this.deleteImage}
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </a>
                </div>
              </MDBCard>
            );
          });
        }
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
          </MDBCard>
        );
      });
    }
    const requiredStar = [];
    requiredStar.push(<b className={style.requiredStar}>*</b>)

    return (
      <MDBContainer className={style.mainContainer}>
        <div className={style.nav}>
          <a className={style.navItem} href="./adminlist">
            <b>Quản lí điểm đến</b>
          </a>
          <FontAwesomeIcon className={style.arrowIcon} icon={faAngleRight} />
          {navItem}
        </div>
        {headerText}
        {submitBtn}
        <div id="errorMessage" className={style.errorMessage}></div>
        <label>
          <b>Tên</b>{requiredStar}
        </label>
        <MDBTextArea
          id="nameInput"
          type="text"
          maxLength="100"
          placeholder="Thêm tên cho điểm đến"
          className={style.textInputs}
          onChange={onTextAreaInput}
          rows={1}
        />
        <label>
          <b>Mô tả</b>{requiredStar}
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
        <MDBRow>
          <label>
            <b>Trực thuộc điểm đến</b>{requiredStar}
          </label>
          {selectDestination}
        </MDBRow>
        <br />
        <br />
        <h3 style={{ textAlign: "center" }}>
          Ảnh Điểm đến
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
export default DestinationAddUpdate;
