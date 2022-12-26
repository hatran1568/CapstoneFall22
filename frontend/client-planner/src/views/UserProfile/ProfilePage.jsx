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
import style from "../SearchResults/SearchResults.module.css";
import axios from "../../api/axios";
import ProfileCard from "./ProfileCard";
import ReactPaginate from "react-paginate";

import TripInfoCard from "../../components/Trips/TripInfoCard";
import CollectionInfoCard from "../../components/Collections/CollectionInfoCard";
import AddCollectionModal from "../../components/Collections/AddCollectionModal";

function ProfilePage() {
  const [curUser, setCurUser] = useState();
  const [myTrips, setMyTrips] = useState();
  const [collectionList, setCollectionList] = useState();
  const [basicActive, setBasicActive] = useState("myTrips");

  const [pageTrips, setPageTrips] = useState(0);
  const [totalPageTrips, setTotalPageTrips] = useState(0);

  const handleBasicClick = (value) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
  };

  const handlePageTripListClick = (event) => {
    setPageTrips(event.selected);
  };

  const id = localStorage.getItem("id");
  const getTripList = () => {
    let pageNumber = 0;
    if (pageTrips != null) {
      pageNumber = pageTrips;
    }

    axios
      .get("/trip/getTripsByUser/" + id + "/" + pageNumber, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setMyTrips(response.data.list);
        setTotalPageTrips(response.data.totalPage);
      });
  };
  useEffect(() => {
    async function getUserProfile() {
      const response = await axios.get("/user/api/user/findById/" + id, {
        headers: { "Content-Type": "application/json" },
      });

      setCurUser(response.data);
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
  useEffect(getTripList, [pageTrips]);
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
                Chuyến đi của tôi
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleBasicClick("myCollection")}
                active={basicActive === "myCollection"}
              >
                Bộ sưu tập của tôi
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
          <MDBTabsContent>
            <MDBTabsPane
              style={{ margin: "auto" }}
              show={basicActive === "myTrips"}
            >
              {myTrips
                ? myTrips.map((trip) => (
                    <TripInfoCard trip={trip} key={trip.tripId} />
                  ))
                : null}
              {myTrips ? (
                <ReactPaginate
                  // className={style.pagination + " pagination"}
                  nextLabel=">"
                  onPageChange={handlePageTripListClick}
                  pageRangeDisplayed={3}
                  marginPagesDisplayed={2}
                  pageCount={totalPageTrips}
                  previousLabel="<"
                  pageClassName={`page-item ${style.pageItem}`}
                  pageLinkClassName={`page-link ${style.pageLink}`}
                  previousClassName={`page-item ${style.pageItem}`}
                  previousLinkClassName={`page-link ${style.pageLink}`}
                  nextClassName={`page-item ${style.pageItem}`}
                  nextLinkClassName={`page-link ${style.pageLink}`}
                  breakLabel="..."
                  breakClassName={`page-item ${style.pageItem}`}
                  breakLinkClassName={`page-link ${style.pageLink}`}
                  containerClassName={`pagination ${style.customPagination}`}
                  activeClassName={`active ${style.active}`}
                  renderOnZeroPageCount={null}
                />
              ) : null}
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
