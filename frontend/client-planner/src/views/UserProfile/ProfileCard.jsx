import { MDBCard, MDBCardLink } from "mdb-react-ui-kit";
import React from "react";
import style from "./Profile.module.css";
function ProfileCard(props) {
  return (
    <MDBCard className={`${style.card} p-3`}>
      <div className={`${style.link} text-end mb-4`}>
        <MDBCardLink href="#">
          <i className="fas fa-pen-alt mx-1"></i>
          Edit profile
        </MDBCardLink>
      </div>
      <div
        className={` d-flex flex-column justify-content-center align-items-center`}
      >
        <div className={style.btn}>
          <img
            className={`${style.avatar} hover-shadow`}
            src={
              props.user.avatar
                ? props.user.avatar
                : "http://www.gravatar.com/avatar/?d=mp"
            }
          />
        </div>
        <span className={`${style.name} mt-3 mx-auto`}>{props.user.name}</span>
        <span className={style.email}>{props.user.email}</span>

        <div className={`px-2 rounded mt-4 ${style.date}`}>
          <span className={style.join}>Joined May,2021</span>
        </div>
      </div>
    </MDBCard>
  );
}

export default ProfileCard;
