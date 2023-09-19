import React from "react";
import ReactDOM from "react-dom";
import { useState, useRef, useMemo } from "react";
import { Modal } from "antd";
import { Component } from "react";
import ReactPaginate from "react-paginate";
import axios from "../../api/axios";
import Dropdown from "react-bootstrap/Dropdown";
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
  faTrash,
  faEye,
  faEyeSlash,
  faLocationDot,
  faSort,
  faSortUp,
  faSortDown,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import style from "./UserList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { confirm } = Modal;
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      dataLoaded: false,
      currentNameKey: "*",
      currentPage: 0,
      pageCount: 0,
      currentFilter: "idASC",
    };
  }
  componentDidMount() {
    document.title = "Danh sách người dùng | Tripplanner";
    axios
      .get(
        "http://localhost:8080/user/api/user/list/admin/" +
          this.state.currentFilter +
          "/" +
          this.state.currentNameKey +
          "/" +
          this.state.currentPage,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      .then((res) => {
        const data = res.data;
        this.setState({
          users: data,
          dataLoaded: true,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
    axios
      .get(
        "http://localhost:8080/user/api/user/list/count/" +
          this.state.currentNameKey,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      .then((res) => {
        const data = res.data;
        this.setState({
          pageCount: data / 30,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
  }

  handlePageClick = async (event) => {
    await this.setState({
      currentPage: event.selected,
    });
    this.componentDidMount();
  };

  searchPOIs = async () => {
    const searchBarName = document.getElementById("searchBarName");
    if (searchBarName.value == null || searchBarName.value == "")
      this.setState({
        currentNameKey: "*",
      });
    else
      this.setState({
        currentNameKey: searchBarName.value,
      });
    this.componentDidMount();
  };

  sortClick = async (event) => {
    await this.setState({
      currentFilter: event.currentTarget.id,
    });
    this.componentDidMount();
  };

  render() {
    const poiTableData = [];
    this.state.users.forEach((entry, index) => {
      const dateModifiedRaw = entry.modified;
      const dateCreatedRaw = entry.created;
      var options = {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      };
      var dateModified = new Date(dateModifiedRaw);
      dateModified = dateModified.toLocaleDateString("vi", options);
      var dateCreated = new Date(dateCreatedRaw);
      dateCreated = dateCreated.toLocaleDateString("vi", options);
      var name = entry.name;
      if (name == " " || name == "") name = "Chưa đặt tên";
      var avatar = entry.avatar;
      if (avatar == null)
        avatar =
          "https://t4.ftcdn.net/jpg/03/59/58/91/360_F_359589186_JDLl8dIWoBNf1iqEkHxhUeeOulx0wOC5.jpg";
      const hideBtn = [];
      if (entry.status == "ACTIVE")
        hideBtn.push(
          <a
            className={style.tableIcons}
            id={entry.userId}
            name={name}
            onClick={this.deactivateUser}
          >
            <FontAwesomeIcon icon={faEyeSlash} />
          </a>,
        );
      if (entry.status == "DEACTIVATED")
        hideBtn.push(
          <a
            className={style.tableIcons}
            id={entry.userId}
            name={name}
            onClick={this.activateUser}
          >
            <FontAwesomeIcon icon={faEye} />
          </a>,
        );
      if (index % 2 == 0)
        poiTableData.push(
          <tr className={style.tableDataGrey}>
            <th scope="col" className={style.tableIdData}>
              {entry.userId}
            </th>
            <th scope="col" className={style.tableAvatar}>
              <img className={style.avatar} src={avatar} />
            </th>
            <th scope="col" className={style.tableNameData}>
              {entry.name}
            </th>
            <th scope="col" className={style.tableDateData}>
              {dateModified}
            </th>
            <th scope="col" className={style.tableDateData}>
              {dateCreated}
            </th>
            <th scope="col" className={style.tableEmailData}>
              {entry.email}
            </th>
            <th scope="col" className={style.tableStatus}>
              {entry.trips}
            </th>
            <th scope="col" className={style.tableRoleData}>
              {entry.roleName}
            </th>
            {/* <th scope='col' className={style.tableActions}>
              {hideBtn}
              <a className={style.tableIcons} id={entry.userId} name={name} onClick={this.deleteUser}><FontAwesomeIcon icon={faTrash}/></a>
            </th> */}
          </tr>,
        );
      else
        poiTableData.push(
          <tr className={style.tableData}>
            <th scope="col" className={style.tableIdData}>
              {entry.userId}
            </th>
            <th scope="col" className={style.tableAvatar}>
              <img className={style.avatar} src={avatar} />
            </th>
            <th scope="col" className={style.tableNameData}>
              {entry.name}
            </th>
            <th scope="col" className={style.tableDateData}>
              {dateModified}
            </th>
            <th scope="col" className={style.tableDateData}>
              {dateCreated}
            </th>
            <th scope="col" className={style.tableEmailData}>
              {entry.email}
            </th>
            <th scope="col" className={style.tableStatus}>
              {entry.trips}
            </th>
            <th scope="col" className={style.tableRoleData}>
              {entry.roleName}
            </th>
            {/* <th scope='col' className={style.tableActions}>
              {hideBtn}
              <a className={style.tableIcons} id={entry.userId} name={name} onClick={this.deleteDes}><FontAwesomeIcon icon={faTrash}/></a>
            </th> */}
          </tr>,
        );
    });
    const tableId = [];
    if (this.state.currentFilter == "idASC")
      tableId.push(
        <th scope="col" className={style.tableId}>
          ID
          <FontAwesomeIcon className={style.sortIcon} icon={faSortUp} />
        </th>,
      );
    else
      tableId.push(
        <th
          scope="col"
          className={style.tableId}
          onClick={this.sortClick}
          id="idASC"
        >
          ID
          <FontAwesomeIcon className={style.sortIcon} icon={faSort} />
        </th>,
      );

    const tableRole = [];
    if (this.state.currentFilter == "roleASC")
      tableRole.push(
        <th
          scope="col"
          className={style.tableRole}
          onClick={this.sortClick}
          id="roleDESC"
        >
          VAI TRÒ
          <FontAwesomeIcon className={style.sortIcon} icon={faSortUp} />
        </th>,
      );
    else if (this.state.currentFilter == "roleDESC")
      tableRole.push(
        <th
          scope="col"
          className={style.tableRole}
          onClick={this.sortClick}
          id="roleASC"
        >
          VAI TRÒ
          <FontAwesomeIcon className={style.sortIcon} icon={faSortDown} />
        </th>,
      );
    else
      tableRole.push(
        <th
          scope="col"
          className={style.tableRole}
          onClick={this.sortClick}
          id="roleDESC"
        >
          VAI TRÒ
          <FontAwesomeIcon className={style.sortIcon} icon={faSort} />
        </th>,
      );

    const tableName = [];
    if (this.state.currentFilter == "nameASC")
      tableName.push(
        <th
          scope="col"
          className={style.tableName}
          onClick={this.sortClick}
          id="nameDESC"
        >
          TÊN
          <FontAwesomeIcon className={style.sortIcon} icon={faSortUp} />
        </th>,
      );
    else if (this.state.currentFilter == "nameDESC")
      tableName.push(
        <th
          scope="col"
          className={style.tableName}
          onClick={this.sortClick}
          id="nameASC"
        >
          TÊN
          <FontAwesomeIcon className={style.sortIcon} icon={faSortDown} />
        </th>,
      );
    else
      tableName.push(
        <th
          scope="col"
          className={style.tableName}
          onClick={this.sortClick}
          id="nameDESC"
        >
          TÊN
          <FontAwesomeIcon className={style.sortIcon} icon={faSort} />
        </th>,
      );

    const tableDate = [];
    if (this.state.currentFilter == "dateASC")
      tableName.push(
        <th
          scope="col"
          className={style.tableDate}
          onClick={this.sortClick}
          id="dateDESC"
        >
          NGÀY SỬA
          <FontAwesomeIcon className={style.sortIcon} icon={faSortUp} />
        </th>,
      );
    else if (this.state.currentFilter == "dateDESC")
      tableName.push(
        <th
          scope="col"
          className={style.tableDate}
          onClick={this.sortClick}
          id="dateASC"
        >
          NGÀY SỬA
          <FontAwesomeIcon className={style.sortIcon} icon={faSortDown} />
        </th>,
      );
    else
      tableName.push(
        <th
          scope="col"
          className={style.tableDate}
          onClick={this.sortClick}
          id="dateDESC"
        >
          NGÀY SỬA
          <FontAwesomeIcon className={style.sortIcon} icon={faSort} />
        </th>,
      );

    return (
      <MDBContainer className={style.bodyContainer}>
        <h2>Quản lí Người dùng</h2>
        <MDBRow>
          <MDBCol md={6} className={style.searchBar}>
            <MDBInputGroup>
              <span className="input-group-text">
                <FontAwesomeIcon icon={faUsers} />
              </span>
              <MDBInput
                label="Tìm theo tên"
                id="searchBarName"
                maxLength={100}
                className={style.searchInput}
              />
              <MDBBtn
                color="info"
                onClick={this.searchPOIs}
                onMouseUp={this.searchPOIs}
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
              {tableId}
              <th scope="col">ẢNH ĐẠI DIỆN</th>
              {tableName}
              <th scope="col">NGÀY TẠO</th>
              {tableDate}
              <th scope="col">EMAIL</th>
              <th scope="col">SỐ CHUYẾN ĐI</th>
              {tableRole}
              {/* <th scope='col'>HÀNH ĐỘNG</th> */}
            </tr>
          </MDBTableHead>
          <MDBTableBody>{poiTableData}</MDBTableBody>
        </MDBTable>
        <ReactPaginate
          nextLabel=" >"
          onPageChange={this.handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={this.state.pageCount}
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
      </MDBContainer>
    );
  }
}
export default UserList;
