import { MDBContainer } from "mdb-react-ui-kit";
import React from "react";
import ProfileCard from "./ProfileCard";

function ProfilePage() {
  return (
    <MDBContainer>
      <div className="col-md-3">
        <ProfileCard />
      </div>
    </MDBContainer>
  );
}

export default ProfilePage;
