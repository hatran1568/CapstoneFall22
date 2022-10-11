import React from "react";
import "./Profile.css";
function Profile() {
  return (
    <div className="card p-3">
      <div className="image d-flex flex-column justify-content-center align-items-center">
        <button className="btn">
          <img src="https://i.imgur.com/wvxPV9S.png" height="100" width="100" />
        </button>
        <span className="name mt-3 mx-auto">Hatran</span>
        <span className="email">test@test</span>

        <div className=" d-flex mt-2">
          <button className="btn1 btn-dark">Edit Profile</button>
        </div>

        <div className=" px-2 rounded mt-4 date ">
          <span className="join">Joined May,2021</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
