import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "./generatemodal.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DestinationSearchBar from "../../components/DestinationSearchBar/DestinationSearchBar";
import {
  MDBBtn,
  MDBCol,
  MDBRow,
  MDBInput,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBCheckbox,
  MDBSpinner,
  MDBIcon,
} from "mdb-react-ui-kit";
function GenerateModal(props) {
  const { toggleShowGenerate, isGenerating, onSubmit, closeGenerate, ...rest } =
    props;
  const [showPreferences, setShowPreferences] = useState(false);
  const [destination, setDestination] = useState(-1);
  const toggleShowMore = () => setShowPreferences(!showPreferences);
  const setSelectedPOI = (item) => {
    document.getElementById("destination").value = item.id;
    setDestination(item.id);
  };
  const submitGenerateTrip = (event) => {
    const startDate = new Date(
      document.getElementById("startDateGenerateInput").value
    );
    const endDate = new Date(
      document.getElementById("endDateGenerateInput").value
    );
    if (document.getElementById("budgetGenerateInput").value == "") {
      document.getElementById("errorEmptyPlan").innerHTML =
        "Hãy nhập ngân sách.";
    } else if (destination == -1) {
      document.getElementById("errorEmptyPlan").innerHTML =
        "Hãy nhập điểm đến.";
    } else if (
      !document.getElementById("startDateGenerateInput").value ||
      !document.getElementById("endDateGenerateInput").value
    ) {
      document.getElementById("errorEmptyPlan").innerHTML =
        "Hãy nhập ngày đi và ngày về";
    } else {
      if (endDate < startDate) {
        document.getElementById("errorEmptyPlan").innerHTML =
          "Ngày đi không thể sau ngày về.";
        return;
      }
      let preferences = [];
      for (let i = 1; i <= 9; i++) {
        let value = document.getElementById(i);
        if (value.checked) {
          preferences.push(i);
        }
      }
      let generateData = {};
      generateData.budget = document.getElementById(
        "budgetGenerateInput"
      ).value;
      generateData.destinationId = destination;
      generateData.startDate = document.getElementById(
        "startDateGenerateInput"
      ).value;
      generateData.endDate = document.getElementById(
        "endDateGenerateInput"
      ).value;
      generateData.userPreference = preferences;
      onSubmit(generateData);
      closeGenerate();
      clearFields();
    }
  };
  const clearFields = () => {
    document.getElementById("budgetGenerateInput").value = "";
    setDestination(-1);
    document.getElementById("startDateGenerateInput").value = null;
    document.getElementById("endDateGenerateInput").value = null;
  };
  return (
    <Modal {...rest} size="lg" centered>
      <MDBModalContent>
        <MDBModalHeader>
          <MDBModalTitle>Gợi ý chuyến đi</MDBModalTitle>
          <MDBBtn
            className="btn-close"
            color="none"
            onClick={toggleShowGenerate}
          ></MDBBtn>
        </MDBModalHeader>

        {isGenerating ? (
          <MDBModalBody>
            <div className="d-flex justify-content-center">
              <span> Đang tìm kiếm chuyến đi tốt nhất.</span>
              <MDBSpinner role="status">
                <span className="visually-hidden"></span>
              </MDBSpinner>
            </div>
          </MDBModalBody>
        ) : (
          <MDBModalBody>
            <MDBRow className={style.modalInput}>
              <div className={style.formgroup}>
                <div className="form-outline"></div>
                <input type="text" id="destination" value="-1" hidden></input>
                <DestinationSearchBar
                  POISelected={setSelectedPOI}
                ></DestinationSearchBar>
              </div>
            </MDBRow>
            <br />
            <MDBRow className={style.modalInput}>
              <div className={style.formgroup}>
                <MDBInput
                  label="Ngân sách"
                  id="budgetGenerateInput"
                  type="number"
                  className={""}
                />
              </div>
            </MDBRow>
            <br />
            <MDBRow className={style.modalInput}>
              <MDBCol className={style.formgroup}>
                <span>Ngày bắt đầu</span>
                <MDBInput
                  placeholder="Select date"
                  type="date"
                  id="startDateGenerateInput"
                  className={style.datepicker}
                />
              </MDBCol>
              <MDBCol className={style.formgroup}>
                <span>Ngày kết thúc</span>
                <MDBInput
                  placeholder="Select date"
                  type="date"
                  id="endDateGenerateInput"
                  className={style.datepicker}
                />
              </MDBCol>
              <div id="errorEmptyPlan" className={style.errorEmptyPlan}></div>
            </MDBRow>
            <br></br>
            <MDBRow className={style.modalGenerateInput}>
              <MDBCol>
                <a onClick={toggleShowMore}>
                  Bạn muốn làm những gì trong chuyến đi{" "}
                  {!showPreferences ? (
                    <MDBIcon fas icon="caret-down" />
                  ) : (
                    <MDBIcon fas icon="caret-up" />
                  )}
                </a>
              </MDBCol>

              <MDBRow
                around
                className={
                  style.optional + " " + (showPreferences && style.show)
                }
              >
                <MDBCol size="4">
                  <MDBCheckbox
                    className={style.formInput}
                    name="ArtAndCulture"
                    id="1"
                    value="1"
                    label="Văn hóa, nghệ thuật"
                  />
                  <MDBCheckbox
                    className={style.formInput}
                    name="Religion"
                    id="3"
                    value="3"
                    label="Tôn giáo"
                  />
                  <MDBCheckbox
                    className={style.formInput}
                    name="Outdoors"
                    id="2"
                    value="2"
                    label="Hoạt động ngoài trời"
                  />
                </MDBCol>

                <br />
                <MDBCol size="4">
                  <MDBCheckbox
                    className={style.formInput}
                    name="Historic&sights"
                    id="4"
                    value="4"
                    label="Lịch sử"
                  />
                  <MDBCheckbox
                    className={style.formInput}
                    name="Museums"
                    id="5"
                    value="5"
                    label="Bảo tàng"
                  />
                  <MDBCheckbox
                    className={style.formInput}
                    name="Beaches"
                    id="8"
                    value="8"
                    label="Bãi biển"
                  />
                </MDBCol>
                <MDBCol size="4">
                  <MDBCheckbox
                    className={style.formInput}
                    name="Spas&Wellness"
                    id="6"
                    value="6"
                    label="Spa & Sức khỏe"
                  />
                  <MDBCheckbox
                    className={style.formInput}
                    name="Shopping"
                    id="7"
                    value="7"
                    label="Mua sắm"
                  />
                  <MDBCheckbox
                    className={style.formInput}
                    name="Nightlife"
                    id="9"
                    value="9"
                    label="Hoạt động đêm"
                  />
                </MDBCol>
              </MDBRow>
            </MDBRow>
          </MDBModalBody>
        )}

        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={toggleShowGenerate}>
            Đóng
          </MDBBtn>
          {!isGenerating ? (
            <MDBBtn onClick={submitGenerateTrip}>Gợi ý chuyến đi</MDBBtn>
          ) : (
            <></>
          )}
        </MDBModalFooter>
      </MDBModalContent>
    </Modal>
  );
}
export default GenerateModal;
