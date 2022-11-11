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
} from "@fortawesome/free-solid-svg-icons";
import style from "./POIList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { confirm } = Modal;
class POIList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pois: [],
      dataLoaded: false,
      currentNameKey: '*',
      currentPage: 0,
      currentCatId: 0,
      pageCount: 0,
      currentFilter: 'idASC'
    };
  }
  componentDidMount() {
    axios.get("http://localhost:8080/api/pois/list/admin/" + this.state.currentFilter + "/" + this.state.currentCatId
              + "/" + this.state.currentNameKey + "/" + this.state.currentPage).then((res) => {
      const data = res.data;
      this.setState({
        pois: data,
        dataLoaded: true,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    axios.get("http://localhost:8080/api/pois/list/admin/count/" + this.state.currentCatId + "/" + this.state.currentNameKey).then((res) => {
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

  deletePOI = async (event) => {
    const poiId = event.currentTarget.id;
    confirm({
      title: "Bạn có chắc mình muốn xóa địa điểm này không?",
      content: "Địa điểm " + event.currentTarget.name + " sẽ bị xóa",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        await axios.post(`http://localhost:8080/api/pois/delete/` + poiId, {});
        this.componentDidMount();
      },
      onCancel() {},
    });
  }

  filterChanged = async (event) => {
    const filterId = event.currentTarget.id;
    const filterDropdown = document.getElementById("filterDropdown");
    filterDropdown.innerHTML = " Danh mục: " + event.currentTarget.name;
    var elems = document.querySelectorAll(".active");
    [].forEach.call(elems, function(el) {
      el.classList.remove("active");
    });
    event.currentTarget.className += " active";
    this.setState({
      currentCatId: filterId
    });
    this.componentDidMount();
  }

  sortClick = async (event) => {
    await this.setState({
      currentFilter: event.currentTarget.id
    });
    this.componentDidMount();
  }

  render() {
    const poiTableData = [];
    this.state.pois.forEach((entry, index) => {
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
      var website = entry.website;
      if (website == null || website == "")
        website = "Chưa có";
      var phone = entry.phoneNumber;
      if (phone == null || phone == "")
        phone = "Chưa có";
      if (index % 2 == 0)
        poiTableData.push(
          <tr className={style.tableDataGrey}>
            <th scope='col' className={style.tableIdData}>{entry.activityId}</th>
            <th scope='col'><a className={style.tableNameData}  href={"../poi?id=" + entry.activityId}>{name}</a></th>
            <th scope='col' className={style.tableDateData}>{dateModified}</th>
            <th scope='col' className={style.tableDateData}>{dateCreated}</th>
            <th scope='col' className={style.tableRateData}>{entry.rating}<FontAwesomeIcon className={style.star} icon={faStar}/></th>
            <th scope='col' className={style.tableCat}>{entry.categoryName}</th>
            <th scope='col' className={style.tableWeb}><a className={style.tableNameData} target="_blank" href={website}>{website}</a></th>
            <th scope='col' className={style.tablePhone}>{phone}</th>
            <th scope='col' className={style.tableActions}>
              <a className={style.tableIcons} href={"./update?id=" + entry.activityId}><FontAwesomeIcon icon={faPenToSquare}/></a>
              <a className={style.tableIcons} id={entry.activityId} name={name} onClick={this.deletePOI}><FontAwesomeIcon icon={faTrash}/></a>
            </th>
          </tr>
        );
      else
        poiTableData.push(
          <tr className={style.tableData}>
            <th scope='col' className={style.tableIdData}>{entry.activityId}</th>
            <th scope='col'><a className={style.tableNameData}  href={"../poi?id=" + entry.activityId}>{name}</a></th>
            <th scope='col' className={style.tableDateData}>{dateModified}</th>
            <th scope='col' className={style.tableDateData}>{dateCreated}</th>
            <th scope='col' className={style.tableRateData}>{entry.rating}<FontAwesomeIcon className={style.star} icon={faStar}/></th>
            <th scope='col' className={style.tableCat}>{entry.categoryName}</th>
            <th scope='col' className={style.tableWeb}><a className={style.tableNameData} target="_blank" href={website}>{website}</a></th>
            <th scope='col' className={style.tablePhone}>{phone}</th>
            <th scope='col' className={style.tableActions}>
              <a className={style.tableIcons} href={"./update?id=" + entry.activityId}><FontAwesomeIcon icon={faPenToSquare}/></a>
              <a className={style.tableIcons} id={entry.activityId} name={name} onClick={this.deletePOI}><FontAwesomeIcon icon={faTrash}/></a>
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

    const tableRate = [];
    if (this.state.currentFilter == "ratingASC")
      tableRate.push(
        <th scope='col' className={style.tableRate} onClick={this.sortClick} id="ratingDESC">ĐÁNH GIÁ<FontAwesomeIcon className={style.sortIcon} icon={faSortUp}/></th>);
    else if (this.state.currentFilter == "ratingDESC")
      tableRate.push(
        <th scope='col' className={style.tableRate} onClick={this.sortClick} id="ratingASC">ĐÁNH GIÁ<FontAwesomeIcon className={style.sortIcon} icon={faSortDown}/></th>);
    else
      tableRate.push(
        <th scope='col' className={style.tableRate} onClick={this.sortClick} id="ratingDESC">ĐÁNH GIÁ<FontAwesomeIcon className={style.sortIcon} icon={faSort}/></th>);

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
        <h2>Quản lí Địa điểm</h2>
        <MDBRow>
          <MDBCol md={1} style={{width:200}}>
            <MDBBtn href="./update?id=0" className={style.createBtn} color="info">Thêm địa điểm</MDBBtn>
          </MDBCol>
          <MDBCol md={6} className={style.searchBar}>
            <MDBInputGroup>
              <span className="input-group-text">
                <FontAwesomeIcon icon={faPlaceOfWorship} />
              </span>
              <MDBInput label='Tìm theo tên' id="searchBarName" maxLength={200} className={style.searchInput}/>
              <MDBBtn color="info" onClick={this.searchPOIs} onMouseUp={this.searchPOIs} rippleColor='dark'>
                <MDBIcon icon='search' />
              </MDBBtn>
            </MDBInputGroup>
          </MDBCol>
          <MDBCol md={3}>
            <Dropdown>
              <Dropdown.Toggle variant="info">
                <FontAwesomeIcon icon="filter"/><span id="filterDropdown"> Danh mục: Tất cả</span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={0} active name="Tất cả">Tất cả</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={1} name="Văn hóa, nghệ thuật">Văn hóa, nghệ thuật</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={2} name="Hoạt động ngoài trời">Hoạt động ngoài trời</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={3} name="Tôn giáo">Tôn giáo</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={4} name="Lịch sử">Lịch sử</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={5} name="Bảo tàng">Bảo tàng</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={6} name="Spa & Sức khỏe">Spa & Sức khỏe</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={7} name="Mua sắm">Mua sắm</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={8} name="Bãi biển">Bãi biển</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={9} name="Hoạt động đêm">Hoạt động đêm</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={10} name="Khách sạn">Khách sạn</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={11} name="Nhà hàng">Nhà hàng</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} onMouseUp={this.filterChanged} id={12} name="Vui chơi giải trí">Vui chơi giải trí</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </MDBCol>
        </MDBRow>
        <MDBTable>
          <MDBTableHead className={style.tableHead}>
          <tr>
            {tableId}
            {tableName}
            <th scope='col'>NGÀY TẠO</th>
            {tableDate}
            {tableRate}
            <th scope='col' className={style.tableCat}>DANH MỤC</th>
            <th scope='col' className={style.tableWeb}>TRANG WEB</th>
            <th scope='col' className={style.tablePhone}>ĐIỆN THOẠI</th>
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
export default POIList;
