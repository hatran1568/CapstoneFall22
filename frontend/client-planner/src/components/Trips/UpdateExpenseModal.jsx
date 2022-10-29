import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Select from "react-dropdown-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faFilter,
  faTrash,
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
function UpdateExpenseModal(props) {
  const { refreshHandler, data } = props;
  //Get Data
  var currentCat = data.expenseCategoryId;
  var modalAmountName = "modalAmount" + data.expenseId;
  var modalDescName = "modalDesc" + data.expenseId;
  var modalCatName = "modalCat" + data.expenseId;
  var modalErrorName = "errorMessage" + data.expenseId;
  const changeCat = (event) => {
    currentCat = event.currentTarget.id;
    document.getElementById(modalCatName).value = event.currentTarget.name;
  };
  //Update Expense
  const addExpense = (event) => {
    const id = window.location.href.split("/")[4];
    if (document.getElementById(modalDescName).value == null)
      document.getElementById(modalDescName).value = " ";
    if (document.getElementById(modalAmountName).value == "") {
      document.getElementById(modalErrorName).innerHTML =
        "Please enter an amount.";
    } else if (currentCat == 0)
      document.getElementById(modalErrorName).innerHTML =
        "Please select a category.";
    else
      axios({
        method: "post",
        url: "http://localhost:8080/api/expense/update",
        data: {
          amount: document.getElementById(modalAmountName).value,
          description: document.getElementById(modalDescName).value,
          expenseCategoryId: currentCat,
          tripId: id,
          expenseId: data.expenseId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        refreshHandler();
        toggleShow();
    });
  };
  //Add Expense Modal
  const [basicModal, setBasicModal] = useState(false);
  const toggleShow = () => {
    setBasicModal(!basicModal);
  };
  return (
    <span>
      <FontAwesomeIcon icon={faPenToSquare} onClick={toggleShow} />
      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent className={style.modalContainer}>
            <MDBModalHeader>
              <MDBModalTitle>Update Expense</MDBModalTitle>
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
                  id={"modalAmount" + data.expenseId}
                  label="Amount"
                  placeholder="Amount"
                  defaultValue={data.amount}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faNoteSticky} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  id={"modalDesc" + data.expenseId}
                  label="Description"
                  placeholder="Description"
                  defaultValue={data.description}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faFilter} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  id={"modalCat" + data.expenseId}
                  label="Category"
                  placeholder="Category"
                  defaultValue={data.name}
                  disabled
                />
              </div>
              <MDBRow>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={1}
                    onClick={changeCat}
                    name="Flight"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faPlane} />
                    <br />
                    Flight
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={2}
                    onClick={changeCat}
                    name="Lodging"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faBed} />
                    <br />
                    Lodging
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={3}
                    onClick={changeCat}
                    name="Car Rental"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faTaxi} />
                    <br />
                    Car Rental
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={4}
                    onClick={changeCat}
                    name="Public Transit"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faBus} />
                    <br />
                    Public Transit
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
                    name="Food"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faUtensils} />
                    <br />
                    Food
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={6}
                    onClick={changeCat}
                    name="Drinks"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faWineGlass} />
                    <br />
                    Drinks
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={7}
                    onClick={changeCat}
                    name="Sightseeing"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faMonument} />
                    <br />
                    Sightseeing
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={8}
                    onClick={changeCat}
                    name="Activities"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faTicket} />
                    <br />
                    Activities
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
                    name="Shopping"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faBagShopping} />
                    <br />
                    Shopping
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={10}
                    onClick={changeCat}
                    name="Gas"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faGasPump} />
                    <br />
                    Gas
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={11}
                    onClick={changeCat}
                    name="Groceries"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faBasketShopping} />
                    <br />
                    Groceries
                  </MDBBtn>
                </MDBCol>
                <MDBCol>
                  <MDBBtn
                    color="dark"
                    id={12}
                    onClick={changeCat}
                    name="Other"
                    className={style.catBtn}
                  >
                    <FontAwesomeIcon icon={faNoteSticky} />
                    <br />
                    Other
                  </MDBBtn>
                </MDBCol>
              </MDBRow>
              <br />
              <div
                id={"errorMessage" + data.expenseId}
                className={style.errorMessage}
              ></div>
              <br />
              <div className={style.modalBtn}>
                <MDBBtn color="info" onClick={addExpense}>
                  Save
                </MDBBtn>
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </span>
  );
}
export default UpdateExpenseModal;
