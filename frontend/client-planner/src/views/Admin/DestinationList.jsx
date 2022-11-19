import React from "react";
import ReactDOM from "react-dom";
import { useState, useRef, useMemo  } from "react";
import { Modal } from "antd";
import { Component } from 'react';
import ReactPaginate from 'react-paginate';
import axios from "../../api/axios";
import Dropdown from 'react-bootstrap/Dropdown';
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
  faPenToSquare,
  faStar,
  faPlaceOfWorship,
  faLocationDot,
  faSort,
  faSortUp,
  faSortDown,
  faMarker,
} from "@fortawesome/free-solid-svg-icons";
import style from "./DestinationList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { confirm } = Modal;
class DestinationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      destinations: [],
      dataLoaded: false,
      currentNameKey: '*',
      currentPage: 0,
      pageCount: 0,
      currentFilter: 'idASC'
    };
  }
  componentDidMount() {
    axios.get("http://localhost:8080/api/destination/admin/list/" + this.state.currentFilter
              + "/" + this.state.currentNameKey + "/" + this.state.currentPage, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                withCredentials: true,
              }).then((res) => {
      const data = res.data;
      this.setState({
        destinations: data,
        dataLoaded: true,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    axios.get("http://localhost:8080/api/destination/admin/list/" + this.state.currentNameKey + "/count", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      withCredentials: true,
    }).then((res) => {
      const data = res.data;
      this.setState({
        pageCount: data / 30,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
  }
  
  handlePageClick = async (event) => {
    await this.setState({
      currentPage: event.selected
    });
    this.componentDidMount();
  };

  searchPOIs = async () => {
    const searchBarName = document.getElementById("searchBarName");
    if (searchBarName.value == null || searchBarName.value == "")
      this.setState({
        currentNameKey: "*"
      })
    else
      this.setState({
        currentNameKey: searchBarName.value
      })
    this.componentDidMount();
  };

  deleteDes = async (event) => {
    const poiId = event.currentTarget.id;
    confirm({
      title: "Bạn có chắc mình muốn xóa điểm đến này không?",
      content: "Điểm đến " + event.currentTarget.name + " sẽ bị xóa",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        await axios.post(`http://localhost:8080/api/destination/delete/` + poiId, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });
        this.componentDidMount();
      },
      onCancel() {},
    });
  }

  sortClick = async (event) => {
    await this.setState({
      currentFilter: event.currentTarget.id
    });
    this.componentDidMount();
  }

  render() {
    const poiTableData = [];
    this.state.destinations.forEach((entry, index) => {
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
      var name = entry.name;
      if (name == " " || name == "")
        name = "Chưa đặt tên";
      if (index % 2 == 0)
        poiTableData.push(
          <tr className={style.tableDataGrey}>
            <th scope='col' className={style.tableIdData}>{entry.desId}</th>
            <th scope='col'><a className={style.tableNameData}  href={"../destination?id=" + entry.desId}>{name}</a></th>
            <th scope='col' className={style.tableDateData}>{dateModified}</th>
            <th scope='col' className={style.tableDateData}>{dateCreated}</th>
            <th scope='col' className={style.tableBelongData}>{entry.belongTo}</th>
            <th scope='col' className={style.tablePOI}>{entry.pois}</th>
            <th scope='col' className={style.tableActions}>
              <a className={style.tableIcons} href={"./update?id=" + entry.desId}><FontAwesomeIcon icon={faPenToSquare}/></a>
              <a className={style.tableIcons} id={entry.desId} name={name} onClick={this.deleteDes}><FontAwesomeIcon icon={faTrash}/></a>
            </th>
          </tr>
        );
      else
        poiTableData.push(
          <tr className={style.tableData}>
            <th scope='col' className={style.tableIdData}>{entry.desId}</th>
            <th scope='col'><a className={style.tableNameData}  href={"../destination?id=" + entry.desId}>{name}</a></th>
            <th scope='col' className={style.tableDateData}>{dateModified}</th>
            <th scope='col' className={style.tableDateData}>{dateCreated}</th>
            <th scope='col' className={style.tableBelongData}>{entry.belongTo}</th>
            <th scope='col' className={style.tablePOI}>{entry.pois}</th>
            <th scope='col' className={style.tableActions}>
              <a className={style.tableIcons} href={"./update?id=" + entry.desId}><FontAwesomeIcon icon={faPenToSquare}/></a>
              <a className={style.tableIcons} id={entry.desId} name={name} onClick={this.deleteDes}><FontAwesomeIcon icon={faTrash}/></a>
            </th>
          </tr>
        );
    })
    const tableId = [];
    if (this.state.currentFilter == "idASC")
      tableId.push(
        <th scope='col' className={style.tableId}>ID<FontAwesomeIcon className={style.sortIcon} icon={faSortUp}/></th>);
    else
      tableId.push(
        <th scope='col' className={style.tableId} onClick={this.sortClick} id="idASC">ID<FontAwesomeIcon className={style.sortIcon} icon={faSort}/></th>);

    const tableBelongTo = [];
    if (this.state.currentFilter == "belongASC")
      tableBelongTo.push(
        <th scope='col' className={style.tableBelong} onClick={this.sortClick} id="belongDESC">TRỰC THUỘC<FontAwesomeIcon className={style.sortIcon} icon={faSortUp}/></th>);
    else if (this.state.currentFilter == "belongDESC")
      tableBelongTo.push(
        <th scope='col' className={style.tableBelong} onClick={this.sortClick} id="belongASC">TRỰC THUỘC<FontAwesomeIcon className={style.sortIcon} icon={faSortDown}/></th>);
    else
      tableBelongTo.push(
        <th scope='col' className={style.tableBelong} onClick={this.sortClick} id="belongDESC">TRỰC THUỘC<FontAwesomeIcon className={style.sortIcon} icon={faSort}/></th>);

    const tableName = [];
    if (this.state.currentFilter == "nameASC")
      tableName.push(
        <th scope='col' className={style.tableName} onClick={this.sortClick} id="nameDESC">TÊN<FontAwesomeIcon className={style.sortIcon} icon={faSortUp}/></th>);
    else if (this.state.currentFilter == "nameDESC")
      tableName.push(
        <th scope='col' className={style.tableName} onClick={this.sortClick} id="nameASC">TÊN<FontAwesomeIcon className={style.sortIcon} icon={faSortDown}/></th>);
    else
      tableName.push(
        <th scope='col' className={style.tableName} onClick={this.sortClick} id="nameDESC">TÊN<FontAwesomeIcon className={style.sortIcon} icon={faSort}/></th>);
    
    const tableDate = [];
    if (this.state.currentFilter == "dateASC")
      tableName.push(
        <th scope='col' className={style.tableDate} onClick={this.sortClick} id="dateDESC">NGÀY SỬA<FontAwesomeIcon className={style.sortIcon} icon={faSortUp}/></th>);
    else if (this.state.currentFilter == "dateDESC")
      tableName.push(
        <th scope='col' className={style.tableDate} onClick={this.sortClick} id="dateASC">NGÀY SỬA<FontAwesomeIcon className={style.sortIcon} icon={faSortDown}/></th>);
    else
      tableName.push(
        <th scope='col' className={style.tableDate} onClick={this.sortClick} id="dateDESC">NGÀY SỬA<FontAwesomeIcon className={style.sortIcon} icon={faSort}/></th>);

        
    return (
      <MDBContainer className={style.bodyContainer}>
        <h2>Quản lí Điểm đến</h2>
        <MDBRow>
          <MDBCol md={1} style={{width:200}}>
            <MDBBtn href="./update?id=0" className={style.createBtn} color="info">Thêm điểm đến</MDBBtn>
          </MDBCol>
          <MDBCol md={6} className={style.searchBar}>
            <MDBInputGroup>
              <span className="input-group-text">
                <FontAwesomeIcon icon={faLocationDot} />
              </span>
              <MDBInput label='Tìm theo tên' id="searchBarName" maxLength={100} className={style.searchInput}/>
              <MDBBtn color="info" onClick={this.searchPOIs} onMouseUp={this.searchPOIs} rippleColor='dark'>
                <MDBIcon icon='search' />
              </MDBBtn>
            </MDBInputGroup>
          </MDBCol>
        </MDBRow>
        <MDBTable>
          <MDBTableHead className={style.tableHead}>
          <tr>
            {tableId}
            {tableName}
            <th scope='col'>NGÀY TẠO</th>
            {tableDate}
            {tableBelongTo}
            <th scope='col' className={style.tablePOI}>SỐ ĐỊA ĐIỂM</th>
            <th scope='col'>HÀNH ĐỘNG</th>
          </tr>
          </MDBTableHead>
          <MDBTableBody>
            {poiTableData}
          </MDBTableBody>
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
    )
  }
}
export default DestinationList;
