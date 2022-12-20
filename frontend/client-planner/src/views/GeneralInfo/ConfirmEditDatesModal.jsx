import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "./TripGeneralInfo.module.css";
import moment from "moment/moment";
import "moment/locale/vi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
function ConfirmEditModal(props) {
  const { onConfirmed, onHide, onCancel, message, listDetails, ...rest } =
    props;
  return (
    <>
      <Modal
        {...rest}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <button
            className={`btn-close ${style.closeBtn}`}
            onClick={onHide}
          ></button>
          <div className={style.confirmModalBody}>
            <div className={style.modalMessage}>
              <span>
                Bạn chắc chắn muốn chỉnh sửa thời gian cho chuyến đi của mình?
              </span>
            </div>
            {listDetails.length > 0 ? (
              <div className={style.listWarning}>
                <div className={style.warningMessage}>
                  Một số hoạt động đã được lên lịch sẽ bị xóa:
                </div>
                {listDetails.map((detail) =>
                  !detail.masterActivity.custom ? (
                    <div
                      className={`row ${style.warningDiv}`}
                      key={detail.tripDetailsId}
                    >
                      <div className="col-8">
                        <strong>{detail.masterActivity.name}</strong>
                        <br />
                        <span>
                          <FontAwesomeIcon icon={faCalendarDays} />
                          {"  "}
                          {moment(detail.date).locale("vi").format("L")}
                        </span>
                      </div>
                      <div className="col-4">
                        {detail.masterActivity.images[0] ? (
                          <img
                            className={style.warningImage}
                            src={
                              detail.masterActivity.images[0]
                                ? detail.masterActivity.images[0].url.includes(
                                    "img/",
                                    0
                                  )
                                  ? `../${detail.masterActivity.images[0].url}`
                                  : detail.masterActivity.images[0].url
                                : "../img/default/detail-img.jpg"
                            }
                          />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`row ${style.warningDiv}`}
                      key={detail.tripDetailsId}
                    >
                      <span>{detail.masterActivity.name}</span>
                      <br />
                      <span>
                        <FontAwesomeIcon icon={faCalendarDays} />
                        {"  "}
                        {moment(detail.date).locale("vi").format("L")}
                      </span>
                    </div>
                  )
                )}
              </div>
            ) : null}
            <div className={style.centerBtnGroup}>
              <Button
                variant="outline-dark"
                onClick={onConfirmed}
                className={style.submitBtn}
              >
                Xác nhận
              </Button>
              <Button onClick={onCancel} variant="outline-secondary">
                Hủy thay đổi
              </Button>
            </div>
            {/* <div className={style.modalMessage}>hoặc</div>
            <div className={style.centerBtnGroup}>
              <Button
                onClick={onHide}
                variant="outline-secondary"
                className={style.submitBtn}
              >
                Tạo một chuyến đi mới
              </Button>
            </div> */}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ConfirmEditModal;
