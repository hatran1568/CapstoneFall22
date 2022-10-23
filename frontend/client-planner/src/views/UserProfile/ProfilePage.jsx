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
  const [myTrips, setMyTrips] = useState();
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

    async function getTripList() {
      const response = await axios.get("/trip/getTripsByUser/" + id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      setMyTrips(response.data);
    }
    document.title = "Profile | Tripplanner";
    getUserProfile();
    getTripList();
  }, []);

  return curUser ? (
    <MDBContainer className="mt-4">
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
            <MDBTabsPane show={basicActive === "myTrips"}>
              {myTrips
                ? myTrips.map((trip) => (
                    <TripInfoCard trip={trip}></TripInfoCard>
                  ))
                : null}
            </MDBTabsPane>
            <MDBTabsPane show={basicActive === "myCollection"}></MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  ) : null;
}

export default ProfilePage;
