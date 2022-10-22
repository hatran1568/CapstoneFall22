import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBRow,
} from "mdb-react-ui-kit";
import axios from "../../api/axios";
import ProfileCard from "./ProfileCard";
import TripInfoCard from "../../components/Trips/TripInfoCard";

function ProfilePage() {
  const [curUser, setCurUser] = useState();
  const [basicActive, setBasicActive] = useState("myTrips");

  const handleBasicClick = (value: string) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  const id = localStorage.getItem("id");

  useEffect(() => {
    async function getUserProfile() {
      const response = await axios.get("/api/user/findById/" + id, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setCurUser(response.data);
    }

    getUserProfile();
  }, []);

  return curUser ? (
    <MDBContainer>
      <MDBRow>
        <MDBCol md="3">
          <ProfileCard user={curUser} />
        </MDBCol>
        <MDBCol md="9">
          <MDBTabs
            className="mb-3"
            style={{
              borderBottom: "1px solid #e0e0e0",
              alignContent: "center",
            }}
          >
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("myTrips")}
                active={basicActive === "myTrips"}
              >
                My Trips
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("myCollection")}
                active={basicActive === "myCollection"}
              >
                My Collection
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
          <MDBTabsContent>
            <MDBTabsPane show={basicActive === "myTrips"}></MDBTabsPane>
            <MDBTabsPane show={basicActive === "myCollection"}>
              Tab 2 content
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  ) : null;
}

export default ProfilePage;
