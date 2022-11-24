import React, { Component, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import style from "./modals.module.css";
import Rating from "../../components/POIs/Rating";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
function DetailActivityModal(props) {
  const { tripDetail, onHide, ...rest } = props;

  const image = tripDetail.masterActivity
    ? tripDetail.masterActivity.images
      ? tripDetail.masterActivity.images[0]
      : null
    : null;
  const imageUrl = image
    ? image.url.includes("img/", 0)
      ? `../${image.url}`
      : image.url
    : "../img/default/detail-img.jpg";
  return (
    <div>
      {tripDetail !== {} ? (
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
            {tripDetail.masterActivity && !tripDetail.masterActivity.custom ? (
              <div className={style.activityInfo}>
                <div className={style.poiDiv}>
                  <img src={imageUrl} alt="" className={style.poiImage} />
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "20px" }}>
                    {tripDetail.masterActivity.name
                      ? tripDetail.masterActivity.name
                      : ""}
                  </div>
                  <div className={style.ratingDiv}>
                    {tripDetail.masterActivity.googleRate ? (
                      <div>
                        <span>
                          <Rating
                            ratings={tripDetail.masterActivity.googleRate}
                          />
                        </span>
                        <span className={style.ratingNum}>
                          {tripDetail.masterActivity.googleRate}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}{" "}
                  </div>
                </div>
                <p className={style.poiDescription}>
                  {tripDetail.masterActivity.description
                    ? tripDetail.masterActivity.description
                    : ""}
                </p>
                <div className={style.linkDiv}>
                  <a
                    href={"../poi?id=" + tripDetail.masterActivity.activityId}
                    className={style.detailLink}
                  >
                    Xem chi tiết địa điểm
                  </a>
                </div>
              </div>
            ) : null}
            <form className={style.editForm}>
              {tripDetail.masterActivity && tripDetail.masterActivity.custom ? (
                <>
                  <label className={style.customLabel}>
                    Name:
                    <input
                      className={`form-control`}
                      name="name"
                      defaultValue={tripDetail.masterActivity.name}
                      disabled
                    />
                  </label>
                  <label className={style.customLabel}>
                    Address:
                    <input
                      className={`form-control`}
                      name="address"
                      defaultValue={tripDetail.masterActivity.address}
                      disabled
                    />
                  </label>
                </>
              ) : (
                <></>
              )}
              {tripDetail.note && tripDetail.note !== "" ? (
                <div>
                  <textarea
                    className={`form-control ${style.noteInput}`}
                    rows="3"
                    defaultValue={tripDetail.note}
                    disabled
                  ></textarea>
                </div>
              ) : null}
            </form>
          </Modal.Body>
        </Modal>
      ) : null}
    </div>
  );
}

export default DetailActivityModal;
