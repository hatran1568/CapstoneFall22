import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Select from "react-dropdown-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import style from "./AddPOIImageModal.module.css";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBInput,
  MDBCard,
} from "mdb-react-ui-kit";
function AddPOIImageModal(props) {
  //Get category Data
  const { refreshHandler } = props;
  //Add Expense
  const addImage = (event) => {
    const loadingIcon = document.getElementById("loadingIcon");
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");

    if (document.getElementById("fileInput").files[0] == null)
      document.getElementById("errorMessageImg").innerHTML =
        "Hãy chọn ảnh.";
    else {
      loadingIcon.style.display = "initial";
      const formData = new FormData();
      formData.append("File", document.getElementById("fileInput").files[0]);
      var desc = document.getElementById("descImgInput").value;
      if (desc == null || desc == "")
        desc = "*";
      axios.post(`http://localhost:8080/api/pois/addImg/` + id + "/" + desc, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }).then(function (response) {
        //window.location.reload();
        refreshHandler();
        toggleShow();
      });
    }
    
  };
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => {
    setBasicModal(!basicModal);
    document.getElementById("fileInput").value = "";
    document.getElementById("descImgInput").value = "";
    document.getElementById("errorMessageImg").innerHTML = "";
    const loadingIcon = document.getElementById("loadingIcon");
    loadingIcon.style.display = "none";
  };
  return (
    <span>
      <MDBCard className={style.imageAddBox} onClick={toggleShow}>
          <FontAwesomeIcon className={style.addIcon} icon={faCirclePlus}/>
      </MDBCard>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent className={style.modalContainer}>
            <MDBModalHeader>
              <MDBModalTitle>Thêm ảnh</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className={style.modalBody}>
              <MDBInput
                type="file"
                id="fileInput"
                accept=".jpg,.jpeg,.png"
              />
              <MDBInput
                type="text"
                id="descImgInput"
                label="Mô tả"
                placeholder="Thêm mô tả ảnh"
                className={style.descInput}
              />
              <div id="errorMessageImg" className={style.errorMessage}></div>
              <img id="loadingIcon" src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif?20170503175831" width="50" />
              <br />
              <div className={style.modalBtn}>
                <MDBBtn color="info" onClick={addImage}>
                  Thêm ảnh
                </MDBBtn>
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </span>
  );
}
export default AddPOIImageModal;
