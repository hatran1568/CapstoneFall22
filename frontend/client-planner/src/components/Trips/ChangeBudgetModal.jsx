import React from "react";
import { useState } from "react";
import style from "./ChangeBudgetModal.module.css";
import axios from "axios";
import Button from "react-bootstrap/Button";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faPen,
  faDongSign,
} from "@fortawesome/free-solid-svg-icons";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
function ModalGraph(props) {
  const { tripId, oldBudget, onBudgetEdited } = props;
  //Breakdown Modal
  const [basicModal, setBasicModal] = useState(false);

  const toggleShow = () => {
    setBasicModal(!basicModal);
  };
  const clear = () => {
    document.getElementById("modalAmountBudget").value = "";
    document.getElementById("errorMessage").innerHTML = "";
  };
  const close = () => {
    // document.getElementById("modalAmountBudget").value = "";
    document.getElementById("errorMessage").innerHTML = "";
    setBasicModal(false);
  };
  const cancel = () => {};
  const editBudget = (event) => {
    let newBudget = document.getElementById("modalAmountBudget").value;
    if (newBudget == "" || newBudget == null || newBudget <= 0) {
      document.getElementById("modalAmountBudget").value = "";
      document.getElementById("errorMessage").innerHTML = "Hãy nhập giá tiền.";
    } else {
      axios({
        method: "post",
        url: "http://localhost:8080/trip/edit-budget",
        data: {
          tripId: tripId,
          budget: newBudget,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          // eslint-disable-next-line no-restricted-globals
          onBudgetEdited(event, newBudget);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          close();
        });
    }
  };
  return (
    <span>
      <a className={style.breakdownBtn} onClick={toggleShow}>
        <FontAwesomeIcon icon={faPen} />
        <b> Chỉnh sửa ngân sách</b>
      </a>
      <MDBModal
        show={basicModal}
        setShow={setBasicModal}
        tabIndex="-1"
        key={tripId}
      >
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalBody>
              <button
                className={`btn-close ${style.closeBtn}`}
                onClick={close}
              ></button>
              <div className="mt-3 mb-4 text-center">
                <h3>Ngân sách</h3>
              </div>
              <div className="input-group mb-2">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faDongSign} />
                </span>
                <input
                  type="number"
                  className="form-control"
                  id="modalAmountBudget"
                  min={0}
                  label="Amount"
                  placeholder="Số tiền"
                  defaultValue={oldBudget}
                />
              </div>

              <div id="errorMessage" className={style.errorMessage}></div>
              <div className={style.okBtnDiv}>
                <Button
                  className={style.submitBtn}
                  onClick={(event) => {
                    editBudget(event);
                  }}
                  variant="outline-secondary"
                >
                  OK
                </Button>
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </span>
  );
}
export default ModalGraph;
