import { MDBCard } from "mdb-react-ui-kit";
import React from "react";
import style from "./Profile.module.css";
function Profile() {
  return (
    <MDBCard className={`${style.card} p-3`}>
      <div
        className={`${style.image} d-flex flex-column justify-content-center align-items-center`}
      >
        <button className={style.btn}>
          <img src="https://i.imgur.com/wvxPV9S.png" height="100" width="100" />
        </button>
        <span className={`${style.name} mt-3 mx-auto`}>Hatran</span>
        <span className={style.email}>test@test</span>

        <div className="d-flex mt-2">
          <button className={`${style.btn1} btn-dark`}>Edit Profile</button>
        </div>

        <div className={`px-2 rounded mt-4 ${style.date}`}>
          <span className={style.join}>Joined May,2021</span>
        </div>
      </div>
    </MDBCard>
  );
}

export default Profile;
