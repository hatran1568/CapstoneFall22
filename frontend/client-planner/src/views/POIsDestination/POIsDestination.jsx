import React from "react";
import ReactDOM from "react-dom"
import {useState} from 'react';
import {useEffect} from 'react';
import {Navigate, useParams } from 'react-router-dom';
import POIBoxLarge from '../../components/POIBoxLarge.jsx';
import axios from "../../api/axios";
import poidata from "./poidata.json";
import ReactPaginate from 'react-paginate';
import cateData from "./category.json";
import { useNavigate } from "react-router-dom";
import {
    MDBBtn,
    MDBContainer
  } from "mdb-react-ui-kit";
import style from './POIsDestination.module.css';
function POIsDestination(){
    const thumbImage = "../" + "../assets/images/hanoi.png";
    const queryParams = new URLSearchParams(window.location.search);
    const desId = queryParams.get('desid');
    const catId = queryParams.get('catid');
    const navigate = useNavigate();
    const [destination, setDestination] = useState([]);
    useEffect(() => {
        const listResp = async () => {
          await axios.get('http://localhost:8080/api/destination/' + desId)
          .then(
            response => setDestination(response.data))
        }
        listResp();
      }, []);
    //POI Data
    const [pois, setPOIs] = useState([]);
    useEffect(() => {
        const listResp = async () => {
          await axios.get('http://localhost:8080/api/pois/' + desId + "/" + 0 + "/" + catId)
          .then(
            response => setPOIs(response.data))
        }
        listResp();
      }, []);
    const [poiscount, setPOICount] = useState([]);
    useEffect(() => {
        const listResp = async () => {
          await axios.get('http://localhost:8080/api/pois/' + desId + "/" + catId + "/count")
          .then(
            response => setPOICount(response.data))
        }
        listResp();
      }, []);
    let poiBox = [];
    pois.forEach((poi, index) => {
        poiBox.push(<POIBoxLarge data={poi}/>)
    });
    const poiSet = document.getElementById("poiSet");
    //Filter
    const catData = cateData;
    const filterBox = [];
    const catBtnClick = (event) => {
        console.log(`${event.target.id}`);
        navigate("./?desid=1&catid=" + event.target.id);
        window.location.reload(false);
    };
    catData.forEach((cat, index) => {
        filterBox.push(<MDBBtn onClick={catBtnClick} id={cat.categoryId} color="secondary" className={style.catButton}>{cat.categoryName}</MDBBtn>)
    });
    filterBox.push(<MDBBtn onClick={catBtnClick} id={0} color="secondary" className={style.removeFilterButton}>Show All</MDBBtn>)
    //Pagination   
    const itemCount = poiscount;
    const itemPerPage = 10;
    const pageCount = itemCount / itemPerPage;
    const handlePageClick = (event) => {
        console.log(`User requested page number ${event.selected}`);
        axios.get('http://localhost:8080/api/pois/' + desId + "/" + event.selected + "/" + catId)
          .then(response => setPOIs(response.data));
        // poiBox = [];
        // pois.forEach((poi, index) => {
        //     poiBox.push(<POIBoxLarge data={poi}/>)
        // });
        // poiSet.innerHTML = '';
        // ReactDOM.render(poiBox, poiSet);
        //setCurrentPage(event.selected);
    };
    return(
        <MDBContainer className={style.mainContainer}>
            <img className={style.thumbnail} src={thumbImage}/>
            <MDBContainer className={style.headContainer}>
                <h1 className={style.title}>Best things to do in<br></br> {destination.name}</h1>
            </MDBContainer>
            <MDBContainer className={style.bodyContainer} id="bodyContainer">
                <h2>Find places by Category</h2>
                {filterBox}<br/><br/>
                <h2>Things to do in {destination.name}</h2>
                <MDBContainer id="poiSet">{poiBox}</MDBContainer><br/>
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                />
            </MDBContainer>
        </MDBContainer>
    )
}
export default POIsDestination;
