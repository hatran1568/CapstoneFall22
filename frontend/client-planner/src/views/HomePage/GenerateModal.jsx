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
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [maxEndDate, setMaxEndDate] = useState();
  const setSelectedPOI = (item) => {
    document.getElementById("destination").value = item.id;
    setDestination(item.id);
  };
  const submitGenerateTrip = (event) => {
    if (destination == -1) {
      document.getElementById("errorEmptyPlan").innerHTML =
        "Hãy nhập điểm đến.";
    } else if (
      document.getElementById("budgetGenerateInput").value == "" ||
      document.getElementById("budgetGenerateInput").value <= 0
    ) {
      document.getElementById("budgetGenerateInput").value = "";
      document.getElementById("errorEmptyPlan").innerHTML =
        "Hãy nhập ngân sách.";
    } else if (!startDate || !endDate) {
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

      var tzoffset = new Date().getTimezoneOffset() * 60000;
      let generateData = {
        budget: document.getElementById("budgetGenerateInput").value,
        destinationId: destination,
        startDate: new Date(startDate - tzoffset)
          .toISOString()
          .substring(0, 10),
        endDate: new Date(endDate - tzoffset).toISOString().substring(0, 10),
        userPreference: preferences,
      };
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
    <div>
      {isGenerating ? (
        <Modal
          {...rest}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Body>
            <button
              className={`btn-close ${style.closeBtn}`}
              onClick={toggleShowGenerate}
            ></button>
            <div className={style.notiBody}>
              Chuyến đi của bạn đang được chuẩn bị <br />
              Kết quả sẽ được gửi về email của bạn khi hoàn thành.
            </div>
            <div className={style.okBtnDiv}>
              <Button
                className={style.submitBtn}
                onClick={toggleShowGenerate}
                variant="outline-secondary"
              >
                OK
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        <Modal {...rest} size="lg" centered>
          <MDBModalHeader className={style.modalHeader}>
            <MDBModalTitle className={style.modalTitle}>
              Gợi ý chuyến đi
            </MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={toggleShowGenerate}
            ></MDBBtn>
          </MDBModalHeader>

          <MDBModalBody className={style.modalBody}>
            <div className={`${style.emptyTripInfo} mb-4`}>
              Tự động tạo một lịch trình dựa theo yêu cầu của bạn.
              <br />
              Kết quả sẽ được gửi về email của bạn khi hoàn thành.
            </div>
            <MDBRow className={style.modalInput}>
              <div className={style.formgroup}>
                <div className="form-outline"></div>
                <input
                  type="text"
                  id="destination"
                  defaultValue="-1"
                  hidden
                ></input>
                <DestinationSearchBar
                  POISelected={setSelectedPOI}
                ></DestinationSearchBar>
              </div>
            </MDBRow>
            <br />
            <MDBRow className={style.modalInput}>
              <div className={style.formgroup}>
                <MDBInput
                  label="Nhập ngân sách (vnđ)"
                  id="budgetGenerateInput"
                  type="number"
                  className={""}
                  min={0}
                />
              </div>
            </MDBRow>
            <br />
            <MDBRow className={style.modalInput}>
              <MDBCol size={6} className={style.formgroup}>
                <span className={style.dateLabel}>Ngày bắt đầu</span>
                {/* <MDBInput
                placeholder="Select date"
                type="date"
                id="startDateGenerateInput"
                className={style.datepicker}
              /> */}
                <DatePicker
                  className="form-control"
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    if (date > endDate) {
                      var newDate = new Date();
                      newDate.setTime(date.getTime());
                      setEndDate(newDate);
                    }
                    var newMaxDate = new Date();
                    newMaxDate.setTime(date.getTime() + 13 * 1000 * 3600 * 24);
                    setMaxEndDate(newMaxDate);
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-start"
                  placeholderText="Chọn ngày bắt đầu"
                />
              </MDBCol>
              <MDBCol size={6} className={style.formgroup}>
                <span className={style.dateLabel}>Ngày kết thúc</span>
                {/* <MDBInput
                placeholder="Select date"
                type="date"
                id="endDateGenerateInput"
                className={style.datepicker}
              /> */}
                <DatePicker
                  disabled={!startDate}
                  className="form-control"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={maxEndDate}
                  dateFormat="dd/MM/yyyy"
                  popperPlacement="bottom-start"
                  placeholderText="Chọn ngày kết thúc"
                />
              </MDBCol>
              <div id="errorEmptyPlan" className={style.errorEmptyPlan}></div>
            </MDBRow>
            <br></br>
            <MDBRow className={style.modalGenerateInput}>
              <MDBCol>
                <a onClick={toggleShowMore} className={style.preferencePrompt}>
                  Bạn muốn làm những gì trong chuyến đi? {"(tùy chọn)  "}
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

          <MDBModalFooter>
            <MDBBtn color="secondary" outline onClick={toggleShowGenerate}>
              Đóng
            </MDBBtn>
            {!isGenerating ? (
              <MDBBtn onClick={submitGenerateTrip} className={style.submitBtn}>
                Gợi ý chuyến đi
              </MDBBtn>
            ) : (
              <></>
            )}
          </MDBModalFooter>
        </Modal>
      )}
    </div>
  );
}
export default GenerateModal;
