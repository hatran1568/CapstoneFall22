import { MDBCol, MDBRow, MDBContainer } from "mdb-react-ui-kit";
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
    setPage(0);
  };
  const handlePageClick = (event) => {
    setPage(event.selected);
  };
  const getResult = () => {
    let API = "http://localhost:8080/location/search/";
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
      .then((data) => {
        setResult(data.list);
        setTotalPage(data.totalPage);
      })
      .catch(() => setResult(false));
  };
  useEffect(getResult, [result != false, type, page]);
  document.title = 'Kết quả tìm kiếm cho "' + keyword + '" | Tripplanner';
  return (
    <MDBContainer>
      <div className={style.pageTitle}>
        Kết quả tìm kiếm cho từ khóa "{keyword}"
      </div>
      <MDBRow>
        <MDBCol size="4">
          <ListTypes onTypeChange={handleUpdateType} />
        </MDBCol>
        <MDBCol size="8">
          {result ? <ListItems list={result}></ListItems> : null}
          {result ? (
            <ReactPaginate
              // className={style.pagination + " pagination"}
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={totalPage}
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
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default SearchResults;
