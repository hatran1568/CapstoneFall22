import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Select from "react-dropdown-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faPlane,
  faBed,
  faTaxi,
  faBus,
  faUtensils,
  faWineGlass,
  faMonument,
  faTicket,
  faBagShopping,
  faGasPump,
  faBasketShopping,
  faNoteSticky,
  faDongSign,
} from "@fortawesome/free-solid-svg-icons";
import style from "./AddExpenseModal.module.css";
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
} from "mdb-react-ui-kit";
function AddExpenseModal(props) {
  //Get category Data
  const { refreshHandler } = props;
  var currentCat = 0;
  const changeCat = (event) => {
    currentCat = event.target.id;
    document.getElementById("modalCat").value = event.target.name;
  };
  //Add Expense
  const addExpense = (event) => {
    const id = window.location.href.split("/")[4];
    if (document.getElementById("modalDesc").value == null || document.getElementById("modalDesc").value == "")
      document.getElementById("modalDesc").value = " ";
    if (document.getElementById("modalAmount").value == "" || document.getElementById("modalAmount").value == null) {
      document.getElementById("errorMessage").innerHTML =
        "Please enter an amount.";
    } else if (currentCat == 0)
      document.getElementById("errorMessage").innerHTML =
        "Please select a category.";
    else
      axios({
        method: "post",
        url: "http://localhost:8080/api/expense/new",
        data: {
          amount: document.getElementById("modalAmount").value,
          description: document.getElementById("modalDesc").value,
          expenseCategoryId: currentCat,
          tripId: id,
          expenseId: 0,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        //window.location.reload();
        refreshHandler();
        toggleShow();
    });
  };
  //Add Expense Modal
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => {
    setBasicModal(!basicModal);
    document.getElementById("modalAmount").value = "";
    document.getElementById("modalDesc").value = "";
    document.getElementById("modalCat").value = "";
    document.getElementById("errorMessage").innerHTML = "";
    currentCat = 0;
  };
  return (
    <span>
      <MDBBtn color="info" onClick={toggleShow}>
        Thêm chi tiêu
      </MDBBtn>
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent className={style.modalContainer}>
            <MDBModalHeader>
              <MDBModalTitle>Thêm chi tiêu</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody className={style.modalBody}>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faDongSign} />
                </span>
                <input
                  type="number"
                  className="form-control"
                  id="modalAmount"
                  label="Amount"
                  placeholder="Số tiền"
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faNoteSticky} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="modalDesc"
                  label="Description"
                  placeholder="Mô tả"
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faFilter} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="modalCat"
                  label="Category"
                  placeholder="Danh mục"
                  disabled
                />
              </div>
              <MDBRow>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={1}
                    onClick={changeCat}
                    name="Vé máy bay"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faPlane} />
                    <br />
                    Vé máy bay
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={2}
                    onClick={changeCat}
                    name="Chỗ ở"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faBed} />
                    <br />
                    Chỗ ở
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={3}
                    onClick={changeCat}
                    name="Thuê xe"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faTaxi} />
                    <br />
                    Thuê xe
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={4}
                    onClick={changeCat}
                    name="Phương tiện công cộng"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faBus} />
                    <br />
                    <span style={{fontSize:8.5}}>Phương tiện công cộng</span>
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
              <br />
              <MDBRow>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={5}
                    onClick={changeCat}
                    name="Đồ ăn"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faUtensils} />
                    <br />
                    Đồ ăn
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={6}
                    onClick={changeCat}
                    name="Đồ uống"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faWineGlass} />
                    <br />
                    Đồ uống
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={7}
                    onClick={changeCat}
                    name="Ngắm cảnh"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faMonument} />
                    <br />
                    Ngắm cảnh
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={8}
                    onClick={changeCat}
                    name="Hoạt động"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faTicket} />
                    <br />
                    Hoạt động
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
              <br />
              <MDBRow>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={9}
                    onClick={changeCat}
                    name="Mua sắm"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faBagShopping} />
                    <br />
                    Mua sắm
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={10}
                    onClick={changeCat}
                    name="Xăng"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faGasPump} />
                    <br />
                    Xăng
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={11}
                    onClick={changeCat}
                    name="Tạp hóa"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faBasketShopping} />
                    <br />
                    Tạp hóa
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={12}
                    onClick={changeCat}
                    name="Khác"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faNoteSticky} />
                    <br />
                    Khác
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
              <br />
              <div id="errorMessage" className={style.errorMessage}></div>
              <br />
              <div className={style.modalBtn}>
                <MDBBtn color="info" onClick={addExpense}>
                  Lưu chi tiêu
                </MDBBtn>
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </span>
  );
}
export default AddExpenseModal;
