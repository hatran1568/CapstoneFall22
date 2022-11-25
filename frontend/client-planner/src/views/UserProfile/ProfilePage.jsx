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
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import axios from "../../api/axios";
import ProfileCard from "./ProfileCard";
import TripInfoCard from "../../components/Trips/TripInfoCard";
import CollectionInfoCard from "../../components/Collections/CollectionInfoCard";
import AddCollectionModal from "../../components/Collections/AddCollectionModal";

function ProfilePage() {
  const [curUser, setCurUser] = useState();
  const [myTrips, setMyTrips] = useState();
  const [collectionList, setCollectionList] = useState();
  const [basicActive, setBasicActive] = useState("myTrips");

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  const id = localStorage.getItem("id");

  useEffect(() => {
    async function getUserProfile() {
      const response = await axios.get("/user/api/user/findById/" + id, {
        headers: { "Content-Type": "application/json" },
      });

      setCurUser(response.data);
    }

    async function getTripList() {
      const response = await axios.get("/trip/getTripsByUser/" + id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setMyTrips(response.data);
    }

    async function getCollectionList() {
      const response = await axios.get("/location/api/collection/list/" + id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setCollectionList(response.data);
    }

    document.title = "Profile | Tripplanner";
    getUserProfile();
    getTripList();
    getCollectionList();
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
                    <TripInfoCard trip={trip} key={trip.tripId} />
                  ))
                : null}
            </MDBTabsPane>
            <MDBTabsPane show={basicActive === "myCollection"}>
              <AddCollectionModal refresh={setCollectionList} />
              {collectionList
                ? collectionList.map((collection) => (
                    <CollectionInfoCard
                      collection={collection}
                      key={collection.collectionId}
                    />
                  ))
                : null}
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  ) : null;
}

export default ProfilePage;
