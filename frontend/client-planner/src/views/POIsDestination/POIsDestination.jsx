import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import POIBoxLarge from "../../components/POIs/POIBoxLarge.jsx";
import axios from "../../api/axios";
import ReactPaginate from "react-paginate";
import cateData from "./category.json";
import { useNavigate } from "react-router-dom";
import FilterRatings from "react-star-ratings";
import {
  MDBBtn,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBRadio,
} from "mdb-react-ui-kit";
import style from "./POIsDestination.module.css";
function POIsDestination() {
  const [thumbImage, setThumbImage] = useState();
  const queryParams = new URLSearchParams(window.location.search);
  const desId = queryParams.get("desid");
  const catId = queryParams.get("catid");
  const rating = queryParams.get("rating");
  if (rating == null) rating = 0;
  const navigate = useNavigate();
  const [destination, setDestination] = useState([]);
  useEffect(() => {
    const listResp = async () => {
      await axios
        .get(
          "http://localhost:8080/location/api/destination/thumbnail/" + desId
        )
        .then((response) => {
          let res = response.data;
          let url = res
            ? res.includes("img\\", 0)
              ? `../${res}`
              : res
            : "../img/default/beach.jpeg";
          setThumbImage(url);
        });
    };
    listResp();
  }, []);
  useEffect(() => {
    const listResp = async () => {
      await axios
        .get("http://localhost:8080/location/api/destination/" + desId)
        .then((response) => setDestination(response.data));
    };
    listResp();
  }, []);
  //POI Data
  const [pois, setPOIs] = useState([]);
  useEffect(() => {
    const listResp = async () => {
      await axios
        .get(
          "http://localhost:8080/location/api/pois/" +
            desId +
            "/" +
            0 +
            "/" +
            catId +
            "/" +
            rating
        )
        .then((response) => setPOIs(response.data));
    };
    listResp();
  }, []);
  const [poiscount, setPOICount] = useState([]);
  useEffect(() => {
    const listResp = async () => {
      await axios
        .get(
          "http://localhost:8080/location/api/pois/" +
            desId +
            "/" +
            catId +
            "/" +
            rating +
            "/count"
        )
        .then((response) => setPOICount(response.data));
    };
    listResp();
  }, []);
  let poiBox = [];
  pois.forEach((poi, index) => {
    poiBox.push(<POIBoxLarge data={poi} />);
  });
  const poiSet = document.getElementById("poiSet");
  //Filter
  const catData = cateData;
  const filterBox = [];
  const catBtnClick = (event) => {
    navigate(
      "?desid=" + desId + "&catid=" + event.target.id + "&rating=" + rating
    );
    window.location.reload(false);
  };
  catData.forEach((cat, index) => {
    if (cat.categoryId == catId)
      filterBox.push(
        <b>
          <div className={style.catButtonSelected}>
            <a onClick={catBtnClick} id={cat.categoryId}>
              {cat.categoryName}
            </a>
          </div>
        </b>
      );
    else
      filterBox.push(
        <div className={style.catButton}>
          <a onClick={catBtnClick} id={cat.categoryId}>
            {cat.categoryName}
          </a>
        </div>
      );
  });
  filterBox.push(
    <div>
      <b>
        <a onClick={catBtnClick} id={0} className={style.removeFilterButton}>
          Xem tất cả
        </a>
      </b>
    </div>
  );
  //FilterRating
  const ratingBtnClick = (event) => {
    navigate(
      "?desid=" +
        desId +
        "&catid=" +
        catId +
        "&rating=" +
        event.currentTarget.id
    );
    window.location.reload(false);
  };
  const filterRatingBox = [];
  const ratingSet = [4, 3, 2, 1];
  ratingSet.forEach((rate, index) => {
    if (rate == rating)
      filterRatingBox.push(
        <a onClick={ratingBtnClick} id={rate}>
          <MDBRow>
            <MDBCol md="1" className={style.filterRatingButton}>
              <MDBRadio inline defaultChecked />
            </MDBCol>
            <MDBCol>
              <FilterRatings
                rating={rate}
                starDimension="20px"
                starSpacing="3px"
                starRatedColor="rgb(255, 162, 0)"
                starEmptyColor="rgb(255, 231, 189)"
              />
            </MDBCol>
          </MDBRow>
        </a>
      );
    else
      filterRatingBox.push(
        <a onClick={ratingBtnClick} id={rate}>
          <MDBRow className={style.ratingRow}>
            <MDBCol md="1" className={style.filterRatingButton}>
              <MDBRadio inline />
            </MDBCol>
            <MDBCol>
              <FilterRatings
                rating={rate}
                starDimension="20px"
                starSpacing="3px"
                starRatedColor="rgb(255, 162, 0)"
                starEmptyColor="rgb(255, 231, 189)"
              />
            </MDBCol>
          </MDBRow>
        </a>
      );
  });
  filterRatingBox.push(
    <b>
      <a onClick={ratingBtnClick} id={0} className={style.removeFilterButton}>
        Xem tất cả
      </a>
    </b>
  );
  //Pagination
  const itemCount = poiscount;
  const itemPerPage = 10;
  const pageCount = itemCount / itemPerPage;
  const handlePageClick = (event) => {
    console.log(`User requested page number ${event.selected}`);
    window.scrollTo(0, 0);
    axios
      .get(
        "http://localhost:8080/location/api/pois/" +
          desId +
          "/" +
          event.selected +
          "/" +
          catId +
          "/" +
          rating
      )
      .then((response) => setPOIs(response.data));
    // poiBox = [];
    // pois.forEach((poi, index) => {
    //     poiBox.push(<POIBoxLarge data={poi}/>)
    // });
    // poiSet.innerHTML = '';
    // ReactDOM.render(poiBox, poiSet);
    //setCurrentPage(event.selected);
  };
  document.title = "Địa điểm tại " + destination.name + " | Tripplanner";
  return (
    <MDBContainer className={style.mainContainer}>
      <img className={style.thumbnail} src={thumbImage} />
      <MDBContainer className={style.headContainer}>
        <h1 className={style.title}>
          Những hoạt động hay nhất tại<br></br> {destination.name}
        </h1>
      </MDBContainer>
      <MDBContainer className={style.bodyContainer} id="bodyContainer">
        <MDBRow>
          <MDBCol md="3" className={style.filterBox}>
            <h2>Bộ lọc</h2>
            <b>Theo danh mục</b>
            <br />
            {filterBox}
            <br />
            <br />
            <b>Theo đánh giá</b>
            <br />
            {filterRatingBox}
          </MDBCol>
          <MDBCol>
            <h2>Các hoạt động tại {destination.name}</h2>
            <MDBContainer id="poiSet">{poiBox}</MDBContainer>
            <br />
            <ReactPaginate
              nextLabel=" >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pageCount}
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
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </MDBContainer>
  );
}
export default POIsDestination;
