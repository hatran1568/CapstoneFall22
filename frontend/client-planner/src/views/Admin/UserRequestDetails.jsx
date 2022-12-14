import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Select from "react-dropdown-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faDownload } from "@fortawesome/free-solid-svg-icons";
import style from "./UserRequestDetails.module.css";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBRow,
  MDBCol,
  MDBModalFooter,
  MDBCard,
} from "mdb-react-ui-kit";
function UserRequestDetails(props) {
  const { refreshHandler, data } = props;
  const [req, setReq] = useState([]);
  useEffect(() => {
    const listResp = async () => {
      await axios
        .get("http://localhost:8080/location/api/request/details/" + data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          setReq(response.data);
        });
    };
    listResp();
  }, []);
  const [images, setImages] = useState([]);
  useEffect(() => {
    const listResp = async () => {
      await axios
        .get("http://localhost:8080/location/api/request/images/" + data, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          setImages(response.data);
        });
    };
    listResp();
  }, []);
  const approve = (event) => {
    axios
      .post(`http://localhost:8080/location/api/request/accept/` + data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(function (response) {
        //window.location.reload();
        refreshHandler();
        toggleShow();
      });
  };
  const reject = (event) => {
    axios
      .post(`http://localhost:8080/location/api/request/reject/` + data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(function (response) {
        //window.location.reload();
        refreshHandler();
        toggleShow();
      });
  };
  //Add Expense Modal
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => {
    setBasicModal(!basicModal);
  };
  const duration = req.duration / 60 / 60;
  //Opening Time
  var sec_num = parseInt(req.open, 10);
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
  const open = hours + ":" + minutes;
  //Closing Time
  var sec_num = parseInt(req.close, 10);
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
  const close = hours + ":" + minutes;

  const imageBox = [];
  if (images.length > 0) {
    images.forEach((entry, index) => {
      imageBox.push(
        <MDBCard className={style.imageBox}>
          <img className={style.poiImage} src={entry} />
          <div className={style.imageContent}>
            <a
              className={style.deleteIcon}
              href={entry}
              download
              target="_blank"
            >
              <FontAwesomeIcon icon={faDownload} />
            </a>
          </div>
        </MDBCard>
      );
    });
  }
  return (
    <span key={data}>
      <a className={style.tableIcons} onClick={toggleShow}>
        <FontAwesomeIcon icon={faCircleInfo} />
      </a>
      <MDBModal
        key={data}
        show={basicModal}
        setShow={setBasicModal}
        tabIndex="-1"
      >
        <MDBModalDialog className={style.modal}>
          <MDBModalContent className={style.modalContainer}>
            <MDBModalHeader>
              <MDBModalTitle>Y??u c???u s???a th??ng tin</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className={style.modalBody}>
              <b>
                <i>
                  ????y l?? nh???ng th??ng tin ng?????i d??ng y??u c???u ch???nh s???a, b???m v??o
                  n??t Ch???nh s???a ????? ?????n trang ch???nh s???a ?????a ??i???m
                </i>
              </b>
              <br />
              <br />
              {req.name != "*" && (
                <MDBRow className={style.tableRow}>
                  <MDBCol md={4}>
                    <b>T??n ?????a ??i???m</b>
                  </MDBCol>
                  <MDBCol md={8}>{req.name}</MDBCol>
                </MDBRow>
              )}
              {req.address != "*" && (
                <MDBRow className={style.tableRow}>
                  <MDBCol md={4}>
                    <b>?????a ch???</b>
                  </MDBCol>
                  <MDBCol md={8}>{req.address}</MDBCol>
                </MDBRow>
              )}
              {req.description != "*" && (
                <MDBRow className={style.tableRow}>
                  <MDBCol md={4}>
                    <b>M?? t???</b>
                  </MDBCol>
                  <MDBCol md={8}>{req.description}</MDBCol>
                </MDBRow>
              )}
              {req.duration != -1 && (
                <MDBRow className={style.tableRow}>
                  <MDBCol md={4}>
                    <b>Kho???ng th???i gian</b>
                  </MDBCol>
                  <MDBCol md={8}>{duration}</MDBCol>
                </MDBRow>
              )}
              {req.info != "*" && (
                <MDBRow className={style.tableRow}>
                  <MDBCol md={4}>
                    <b>Th??ng tin th??m</b>
                  </MDBCol>
                  <MDBCol md={8}>{req.info}</MDBCol>
                </MDBRow>
              )}
              {req.price != -1 && (
                <MDBRow className={style.tableRow}>
                  <MDBCol md={4}>
                    <b>Gi?? trung b??nh</b>
                  </MDBCol>
                  <MDBCol md={8}>{req.price}</MDBCol>
                </MDBRow>
              )}
              {req.email != "*" && (
                <MDBRow className={style.tableRow}>
                  <MDBCol md={4}>
                    <b>Email</b>
                  </MDBCol>
                  <MDBCol md={8}>{req.email}</MDBCol>
                </MDBRow>
              )}
              {req.phone != "*" && (
                <MDBRow className={style.tableRow}>
                  <MDBCol md={4}>
                    <b>??i???n tho???i</b>
                  </MDBCol>
                  <MDBCol md={8}>{req.phone}</MDBCol>
                </MDBRow>
              )}
              {req.open != -1 && (
                <MDBRow className={style.tableRow}>
                  <MDBCol md={4}>
                    <b>Gi??? m??? c???a</b>
                  </MDBCol>
                  <MDBCol md={8}>{open}</MDBCol>
                </MDBRow>
              )}
              {req.close != -1 && (
                <MDBRow className={style.tableRow}>
                  <MDBCol md={4}>
                    <b>Gi??? ????ng c???a</b>
                  </MDBCol>
                  <MDBCol md={8}>{close}</MDBCol>
                </MDBRow>
              )}
              <br />
              {images.length > 0 && (
                <b>
                  <i>
                    ???nh ng?????i d??ng mu???n th??m, t???i v??? ????? ch???nh s???a
                    <br />
                  </i>
                </b>
              )}
              {imageBox}
            </MDBModalBody>
            <MDBModalFooter>
              <div className={style.modalBtn}>
                <a href={"/poi/update?id=" + data} target="_blank">
                  <MDBBtn color="info">Ch???nh s???a</MDBBtn>
                </a>
              </div>
              <div className={style.modalBtn}>
                <MDBBtn color="info" onClick={approve}>
                  Ch???p nh???n
                </MDBBtn>
              </div>
              <div className={style.modalBtn}>
                <MDBBtn color="info" onClick={reject}>
                  T??? ch???i
                </MDBBtn>
              </div>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </span>
  );
}
export default UserRequestDetails;
