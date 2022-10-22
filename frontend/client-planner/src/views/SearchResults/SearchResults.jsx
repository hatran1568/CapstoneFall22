import {
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdownLink,
  MDBCollapse,
  MDBRipple,
  MDBBadge,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import axios from "../../api/axios";
import ListItems from "./ListItems";
import ListTypes from "./ListTypes";
import style from "./SearchResults.module.css";
import "../../components/searchBar/override.css";
function SearchResults(props) {
  const [type, setType] = useState(false);
  const [result, setResult] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const url = new URL(window.location.href);
  const keyword = url.searchParams.get("search");

  const handleUpdateType = (child) => {
    console.log(child);
    setType(child);
  };
  const handlePageClick = (event) => {
    setPage(event.selected);
  };
  const getResult = () => {
    let API = "http://localhost:8080/search/";
    let pageNumber = 0;
    if (page != null) {
      pageNumber = page;
    }
    if (type === false) {
      API += keyword + "/" + pageNumber;
    } else {
      API += "filter/" + keyword + "/" + pageNumber + "/" + type;
    }
    axios
      .get(API, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => response.data)
      .catch(() => setResult(false))
      .then((data) => {
        setResult(data.list);
        setTotalPage(data.totalPage);
      });
  };

  useEffect(getResult, [result != false, type, page]);
  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol size='4'>
          <ListTypes onTypeChange={handleUpdateType} />
        </MDBCol>
        <MDBCol size='8'>
          {result && <ListItems list={result}></ListItems>}
          {result && (
            <ReactPaginate
              className={style.pagination + " pagination"}
              nextLabel='>'
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={totalPage}
              previousLabel='<'
              pageClassName={style.page + " page-item"}
              pageLinkClassName={"page-link " + style.page}
              previousClassName={style.next + " page-item"}
              previousLinkClassName={"page-link " + style.next}
              nextClassName={"page-item " + style.next}
              nextLinkClassName={"page-link " + style.next}
              breakLabel='...'
              breakClassName={"page-item " + style.page}
              breakLinkClassName={"page-link " + style.page}
              containerClassName='pagination'
              activeClassName='active'
              renderOnZeroPageCount={null}
            />
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default SearchResults;
