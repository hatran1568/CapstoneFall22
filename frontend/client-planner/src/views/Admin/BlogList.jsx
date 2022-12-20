import React from "react";
import ReactDOM from "react-dom";
import { useState, useRef, useMemo } from "react";
import { Modal } from "antd";
import { Component } from "react";
import ReactPaginate from "react-paginate";
import axios from "../../api/axios";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import {
  faSearch,
  faTrash,
  faPenToSquare,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import style from "./BlogList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { confirm } = Modal;
class BlogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: [],
      dataLoaded: false,
      currentKeyword: "*",
      currentPage: 0,
      pageCount: 0,
    };
  }
  componentDidMount() {
    document.title = "Danh sách blog | Tripplanner"
    axios
      .get(
        "http://localhost:8080/blog/api/blog/admin/" +
          this.state.currentKeyword +
          "/" +
          this.state.currentPage,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        const data = res.data;
        this.setState({
          blogs: data,
          dataLoaded: true,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
    axios
      .get(
        "http://localhost:8080/blog/api/blog/admin/" +
          this.state.currentKeyword +
          "/" +
          this.state.currentPage +
          "/count",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        const data = res.data;
        this.setState({
          pageCount: data / 10,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
  }

  handlePageClick = (event) => {
    console.log(`User requested page number ${event.selected}`);
    axios
      .get(
        "http://localhost:8080/blog/api/blog/admin/" +
          this.state.currentKeyword +
          "/" +
          event.selected,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => this.setState({ blogs: response.data }));
  };

  createBlog = (event) => {
    axios({
      method: "post",
      url:
        "http://localhost:8080/blog/api/blog/new/" + localStorage.getItem("id"),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(function (response) {
      //window.location.reload();
      window.location.replace("./update?id=" + response.data);
    });
  };

  searchBlogs = () => {
    const searchBar = document.getElementById("searchBar");
    if (searchBar.value == null || searchBar.value == "")
      this.setState({
        currentKeyword: "*",
      });
    else
      this.setState({
        currentKeyword: searchBar.value,
      });
    console.log(this.state.currentKeyword);
    this.componentDidMount();
  };

  deleteBlog = async (event) => {
    const blogId = event.currentTarget.id;
    confirm({
      title: "Bạn có chắc mình muốn xóa bài blog này không?",
      content: "Bài blog này sẽ bị xóa",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        await axios.post(
          `http://localhost:8080/blog/api/blog/delete/` + blogId,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        //window.location.reload();
        this.componentDidMount();
      },
      onCancel() {},
    });
  };

  hideBlog = async (event) => {
    const blogId = event.currentTarget.id;
    confirm({
      title: "Bạn có chắc mình muốn ẩn bài blog này không?",
      content: "Bài blog này sẽ bị ẩn",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        await axios.post(`http://localhost:8080/blog/api/blog/hide/` + blogId, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        //window.location.reload();
        this.componentDidMount();
      },
      onCancel() {},
    });
  };

  unhideBlog = async (event) => {
    const blogId = event.currentTarget.id;
    confirm({
      title: "Bạn có chắc mình muốn hiện bài blog này không?",
      content: "Bài blog này sẽ được hiện",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        await axios.post(
          `http://localhost:8080/blog/api/blog/unhide/` + blogId,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        //window.location.reload();
        this.componentDidMount();
      },
      onCancel() {},
    });
  };

  render() {
    const blogTableData = [];
    this.state.blogs.forEach((entry, index) => {
      const dateModifiedRaw = entry.dateModified;
      const dateCreatedRaw = entry.dateCreated;
      var options = {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      };
      var dateModified = new Date(dateModifiedRaw);
      dateModified = dateModified.toLocaleDateString("vi", options);
      var dateCreated = new Date(dateCreatedRaw);
      dateCreated = dateCreated.toLocaleDateString("vi", options);
      var thumbnail = entry.thumbnail;
      if (thumbnail == " ")
        thumbnail =
          "https://twimg0-a.akamaihd.net/a/1350072692/t1/img/front_page/jp-mountain@2x.jpg";
      var title = entry.title;
      if (title == " ") title = "Chưa đặt tên";
      const hideBtn = [];
      if (entry.status == "PUBLISHED")
        hideBtn.push(
          <a
            className={style.tableIcons}
            id={entry.blogId}
            onClick={this.hideBlog}
          >
            <FontAwesomeIcon icon={faEyeSlash} />
          </a>
        );
      if (entry.status == "HIDDEN")
        hideBtn.push(
          <a
            className={style.tableIcons}
            id={entry.blogId}
            onClick={this.unhideBlog}
          >
            <FontAwesomeIcon icon={faEye} />
          </a>
        );
      if (index % 2 == 0)
        blogTableData.push(
          <tr className={style.tableDataGrey}>
            <th scope="col">{entry.blogId}</th>
            <th scope="col">
              <img className={style.thumbnail} src={thumbnail} />
            </th>
            <th scope="col">
              <a
                className={style.tableTitleData}
                href={"../blog?id=" + entry.blogId}
              >
                {title}
              </a>
            </th>
            <th scope="col" className={style.tableDate}>
              {dateCreated}
            </th>
            <th scope="col" className={style.tableDate}>
              {dateModified}
            </th>
            <th scope="col" className={style.tableStatus}>
              {entry.status}
            </th>
            <th scope="col" className={style.tableAuthor}>
              <img className={style.avatar} src={entry.avatar} />
              {entry.username}
            </th>
            <th scope="col" className={style.tableActions}>
              <a
                className={style.tableIcons}
                href={"./update?id=" + entry.blogId}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </a>
              {hideBtn}
              <a
                className={style.tableIcons}
                id={entry.blogId}
                onClick={this.deleteBlog}
              >
                <FontAwesomeIcon icon={faTrash} />
              </a>
            </th>
          </tr>
        );
      else
        blogTableData.push(
          <tr className={style.tableData}>
            <th scope="col">{entry.blogId}</th>
            <th scope="col">
              <img className={style.thumbnail} src={thumbnail} />
            </th>
            <th scope="col">
              <a
                className={style.tableTitleData}
                href={"../blog?id=" + entry.blogId}
              >
                {title}
              </a>
            </th>
            <th scope="col" className={style.tableDate}>
              {dateCreated}
            </th>
            <th scope="col" className={style.tableDate}>
              {dateModified}
            </th>
            <th scope="col" className={style.tableStatus}>
              {entry.status}
            </th>
            <th scope="col" className={style.tableAuthor}>
              <img className={style.avatar} src={entry.avatar} />
              {entry.username}
            </th>
            <th scope="col" className={style.tableActions}>
              <a
                className={style.tableIcons}
                href={"./update?id=" + entry.blogId}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </a>
              {hideBtn}
              <a
                className={style.tableIcons}
                id={entry.blogId}
                onClick={this.deleteBlog}
              >
                <FontAwesomeIcon icon={faTrash} />
              </a>
            </th>
          </tr>
        );
    });
    return (
      <MDBContainer className={style.bodyContainer}>
        <h2>Quản lí Blog</h2>
        <MDBRow>
          <MDBCol md={1} style={{ width: 130 }}>
            <MDBBtn
              onClick={this.createBlog}
              className={style.createBtn}
              color="info"
            >
              Tạo Blog
            </MDBBtn>
          </MDBCol>
          <MDBCol md={6} className={style.searchBar}>
            <MDBInputGroup>
              <MDBInput
                label="Tìm kiếm"
                id="searchBar"
                maxLength={300}
                onChange={this.searchBlogs}
                onKeyUp={this.searchBlogs}
                className={style.searchInput}
              />
              <MDBBtn
                color="info"
                onClick={this.searchBlogs}
                rippleColor="dark"
              >
                <MDBIcon icon="search" />
              </MDBBtn>
            </MDBInputGroup>
          </MDBCol>
        </MDBRow>
        <MDBTable>
          <MDBTableHead className={style.tableHead}>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">ẢNH BÌA</th>
              <th scope="col" className={style.tableTitle}>
                TIÊU ĐỀ
              </th>
              <th scope="col" className={style.tableDate}>
                NGÀY TẠO
              </th>
              <th scope="col" className={style.tableDate}>
                NGÀY SỬA
              </th>
              <th scope="col" className={style.tableStatus}>
                TRẠNG THÁI
              </th>
              <th scope="col" className={style.tableAuthor}>
                TÁC GIẢ
              </th>
              <th scope="col">HÀNH ĐỘNG</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>{blogTableData}</MDBTableBody>
        </MDBTable>
        <ReactPaginate
          nextLabel=" >"
          onPageChange={this.handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={this.state.pageCount}
          previousLabel="<"
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
    );
  }
}
export default BlogList;
