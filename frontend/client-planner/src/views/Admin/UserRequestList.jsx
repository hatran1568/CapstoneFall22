import React from "react";
import ReactDOM from "react-dom";
import { useState, useRef, useMemo } from "react";
import { Modal } from "antd";
import { Component } from "react";
import ReactPaginate from "react-paginate";
import axios from "../../api/axios";
import Dropdown from "react-bootstrap/Dropdown";
import UserRequestDetails from "./UserRequestDetails";
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
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import style from "./UserRequestList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { confirm } = Modal;
class UserRequestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      dataLoaded: false,
      currentNameKey: "*",
      currentPage: 0,
      pageCount: 0,
      currentFilter: "idASC",
    };
  }
  componentDidMount() {
    document.title = "Danh sách yêu cầu chỉnh sửa | Tripplanner";
    axios
      .get(
        "http://localhost:8080/location/api/request/list/" +
          this.state.currentFilter +
          "/" +
          this.state.currentNameKey +
          "/" +
          this.state.currentPage,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        const data = res.data;
        this.setState({
          requests: data,
          dataLoaded: true,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
    axios
      .get(
        "http://localhost:8080/location/api/request/list/count/" +
          this.state.currentNameKey,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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

  deleteUser = async (event) => {
    const userId = event.currentTarget.id;
    confirm({
      title: "Bạn có chắc mình muốn xóa người dùng này không?",
      content: "Người dùng " + event.currentTarget.name + " sẽ bị xóa",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        await axios.post(
          `http://localhost:8080/location/api/user/delete/` + userId,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.componentDidMount();
      },
      onCancel() {},
    });
  };

  sortClick = async (event) => {
    await this.setState({
      currentFilter: event.currentTarget.id,
    });
    this.componentDidMount();
  };

  render() {
    const poiTableData = [];
    this.state.requests.forEach((entry, index) => {
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
      // const hideBtn = [];
      // if (entry.status == "ACTIVE")
      //   hideBtn.push(
      //   <a className={style.tableIcons} id={entry.userId} name={name} onClick={this.deactivateUser}><FontAwesomeIcon icon={faEyeSlash}/></a>
      //   );
      // if (entry.status == "DEACTIVATED")
      //   hideBtn.push(
      //   <a className={style.tableIcons} id={entry.userId} name={name} onClick={this.activateUser}><FontAwesomeIcon icon={faEye}/></a>
      //   );
      if (index % 2 == 0)
        poiTableData.push(
          <tr className={style.tableDataGrey}>
            <th scope="col" className={style.tableIdData}>
              {entry.requestId}
            </th>
            <th scope="col" className={style.tableAuthor}>
              <img className={style.avatar} src={avatar} />
              {entry.username}
            </th>
            <th scope="col" className={style.tableDateData}>
              {dateModified}
            </th>
            <th scope="col" className={style.tableDateData}>
              {dateCreated}
            </th>
            <th scope="col" className={style.tablePoiName}>
              {entry.poiName}
            </th>
            <th scope="col" className={style.tableStatus}>
              {entry.status}
            </th>
            <th scope="col" className={style.tableActions}>
              <UserRequestDetails
                data={entry.requestId}
                refreshHandler={() => this.componentDidMount()}
              />
              {/* <a className={style.tableIcons} id={entry.userId} name={name} onClick={this.deleteUser}><FontAwesomeIcon icon={faTrash}/></a> */}
            </th>
          </tr>
        );
      else
        poiTableData.push(
          <tr className={style.tableData}>
            <th scope="col" className={style.tableIdData}>
              {entry.requestId}
            </th>
            <th scope="col" className={style.tableAuthor}>
              <img className={style.avatar} src={avatar} />
              {entry.username}
            </th>
            <th scope="col" className={style.tableDateData}>
              {dateModified}
            </th>
            <th scope="col" className={style.tableDateData}>
              {dateCreated}
            </th>
            <th scope="col" className={style.tablePoiName}>
              {entry.poiName}
            </th>
            <th scope="col" className={style.tableStatus}>
              {entry.status}
            </th>
            <th scope="col" className={style.tableActions}>
              <UserRequestDetails
                data={entry.requestId}
                refreshHandler={() => this.componentDidMount()}
              />
              {/* <a className={style.tableIcons} id={entry.userId} name={name} onClick={this.deleteDes}><FontAwesomeIcon icon={faTrash}/></a> */}
            </th>
          </tr>
        );
    });
    const tableId = [];
    if (this.state.currentFilter == "idASC")
      tableId.push(
        <th scope="col" className={style.tableId}>
          ID
          <FontAwesomeIcon className={style.sortIcon} icon={faSortUp} />
        </th>
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
        </th>
      );

    const tablePOI = [];
    if (this.state.currentFilter == "poiASC")
      tablePOI.push(
        <th
          scope="col"
          className={style.tableName}
          onClick={this.sortClick}
          id="poiDESC"
        >
          ĐỊA ĐIỂM
          <FontAwesomeIcon className={style.sortIcon} icon={faSortUp} />
        </th>
      );
    else if (this.state.currentFilter == "poiDESC")
      tablePOI.push(
        <th
          scope="col"
          className={style.tableName}
          onClick={this.sortClick}
          id="poiASC"
        >
          ĐỊA ĐIỂM
          <FontAwesomeIcon className={style.sortIcon} icon={faSortDown} />
        </th>
      );
    else
      tablePOI.push(
        <th
          scope="col"
          className={style.tableName}
          onClick={this.sortClick}
          id="poiDESC"
        >
          ĐỊA ĐIỂM
          <FontAwesomeIcon className={style.sortIcon} icon={faSort} />
        </th>
      );

    const tableDate = [];
    if (this.state.currentFilter == "dateASC")
      tableDate.push(
        <th
          scope="col"
          className={style.tableDate}
          onClick={this.sortClick}
          id="dateDESC"
        >
          NGÀY SỬA
          <FontAwesomeIcon className={style.sortIcon} icon={faSortUp} />
        </th>
      );
    else if (this.state.currentFilter == "dateDESC")
      tableDate.push(
        <th
          scope="col"
          className={style.tableDate}
          onClick={this.sortClick}
          id="dateASC"
        >
          NGÀY SỬA
          <FontAwesomeIcon className={style.sortIcon} icon={faSortDown} />
        </th>
      );
    else
      tableDate.push(
        <th
          scope="col"
          className={style.tableDate}
          onClick={this.sortClick}
          id="dateDESC"
        >
          NGÀY SỬA
          <FontAwesomeIcon className={style.sortIcon} icon={faSort} />
        </th>
      );

    return (
      <MDBContainer className={style.bodyContainer}>
        <h2>Quản lí Yêu cầu thay đổi Thông tin</h2>
        <MDBRow>
          <MDBCol md={6} className={style.searchBar}>
            <MDBInputGroup>
              <span className="input-group-text">
                <FontAwesomeIcon icon={faPenToSquare} />
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
              <th scope="col">NGƯỜI YÊU CẦU</th>
              <th scope="col">NGÀY TẠO</th>
              {tableDate}
              {tablePOI}
              <th scope="col">TRẠNG THÁI</th>
              <th scope="col">HÀNH ĐỘNG</th>
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
export default UserRequestList;
