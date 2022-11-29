import React, { useState } from "react";
import style from "./TripGeneralInfo.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  faMapPin,
  faCalendar,
  faMapLocationDot,
  faCheck,
  faCaretDown,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

import { useLocation, useParams } from "react-router-dom";
export default function Tabs(props) {
  const location = useLocation();
  var path = location.pathname.slice(0, location.pathname.lastIndexOf("/"));
  var params = useParams();
  const [status, setStatus] = useState(props.status ? props.status : "");
  const toggleStatus = () => {
    var newStatus = status;
    if (newStatus.toLowerCase() == "public") newStatus = "private";
    else if (newStatus.toLowerCase() == "private") newStatus = "public";
    if (newStatus.length > 0) {
      const data = {
        tripId: params.id,
        status: newStatus,
      };
      console.log("data: ", data);
      axios
        .post("/trip/toggle-status", data)
        .then(() => {
          setStatus(newStatus);
          toast.success("Lưu thay đổi thành công!", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch(() => {})
        .finally(() => {
          toggleShowConfirm();
        });
    }
  };
  const [confirmModal, setConfirmModal] = useState(false);
  const toggleShowConfirm = () => setConfirmModal(!confirmModal);
  return (
    <div className={`${style.stickyNavFirst}`}>
      <ul
        className={`nav nav-tabsgit status
       justify-content-center ${style.navTabs} `}
      >
        <li className={`nav-item ${style.dropDown}`}>
          <a
            className={
              path.toLowerCase() == "/timeline" ||
              path.toLowerCase() == "/timetable" ||
              path.toLowerCase() == "/map"
                ? `nav-link active ${style.navItem} ${style.navItemActive}`
                : `nav-link ${style.navItem}`
            }
          >
            Kế hoạch theo ngày{" "}
            <FontAwesomeIcon
              icon={faCaretDown}
              className={style.dropDownIcon}
              size="lg"
            />
          </a>
          <div className={style.dropdownContent}>
            <a
              href={"../timeline/" + params.id}
              className={path == "/timeline" ? style.active : ""}
            >
              <FontAwesomeIcon icon={faMapPin} className={style.icons} />
              Mốc thời gian{" "}
              {path.toLowerCase() == "/timeline" && (
                <FontAwesomeIcon icon={faCheck} className={style.checkIcons} />
              )}
            </a>
            <a
              href={"../timetable/" + params.id}
              className={path == "/timetable" ? style.active : ""}
            >
              <FontAwesomeIcon icon={faCalendar} className={style.icons} />
              Thời gian biểu
              {path.toLowerCase() == "/timetable" && (
                <FontAwesomeIcon icon={faCheck} className={style.checkIcons} />
              )}
            </a>
            <a
              href={"../map/" + params.id}
              className={path == "/map" ? style.active : ""}
            >
              <FontAwesomeIcon
                icon={faMapLocationDot}
                className={style.icons}
              />
              Bản đồ
              {path.toLowerCase() == "/map" && (
                <FontAwesomeIcon icon={faCheck} className={style.checkIcons} />
              )}
            </a>
          </div>
        </li>
        <li className="nav-item">
          <a
            className={
              path == "/checklist"
                ? `nav-link active ${style.navItem} ${style.navItemActive}`
                : `nav-link ${style.navItem}`
            }
            href={"../checklist/" + params.id}
          >
            Việc cần làm
          </a>
        </li>
        <li className="nav-item">
          <a
            className={
              path == "/budget"
                ? `nav-link active ${style.navItem} ${style.navItemActive}`
                : `nav-link ${style.navItem}`
            }
            href={"../budget/" + params.id}
          >
            Ngân sách
          </a>
        </li>
        {props.own == true ? (
          <li className="nav-item">
            {status.toLowerCase() == "public" ? (
              <a
                className={`nav-link ${style.navItem}`}
                data-mdb-toggle="tooltip"
                title="Kế hoạch công khai"
                onClick={() => setConfirmModal(true)}
              >
                <FontAwesomeIcon icon={faEye} />
              </a>
            ) : (
              <a
                className={`nav-link ${style.navItem}`}
                data-mdb-toggle="tooltip"
                title="Kế hoạch riêng tư"
                onClick={() => setConfirmModal(true)}
              >
                <FontAwesomeIcon icon={faEyeSlash} />
              </a>
            )}
          </li>
        ) : null}
      </ul>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={confirmModal}
      >
        <Modal.Header className={style.modalHeader}>
          <div className={style.modalTitle}>
            Đổi chuyến đi sang trạng thái{" "}
            {status.toLowerCase() == "public" ? "riêng tư" : "công khai"}
          </div>
          <button
            className={`btn-close ${style.closeBtn}`}
            onClick={toggleShowConfirm}
          ></button>
        </Modal.Header>
        <Modal.Body className={style.editModal}>
          <div className={style.statusModalBody}>
            {status.toLowerCase() == "private"
              ? 'Tất cả mọi người sẽ được thấy chuyến đi của bạn khi ở chế độ "Công khai"'
              : 'Chỉ mình bạn có thể xem chuyến đi của mình trong chế độ "Riêng tư"'}
          </div>
          <div className={style.btnGroup}>
            <Button
              variant="outline-dark"
              onClick={toggleStatus}
              className={style.submitBtn}
            >
              Lưu
            </Button>
            <Button onClick={toggleShowConfirm} variant="outline-secondary">
              Hủy
            </Button>
          </div>
        </Modal.Body>
      </Modal>
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
      />
    </div>
  );
}
