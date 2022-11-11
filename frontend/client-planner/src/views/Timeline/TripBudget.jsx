import React, { Component } from "react";
import TripDetailTabs from "../GeneralInfo/TripDetailTabs";
import style from "./TripBudget.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Modal } from "antd";
import { Progress } from "antd";
import ModalGraph from "../../components/Trips/ModalGraph";
import AddExpenseModal from "../../components/Trips/AddExpenseModal";
import UpdateExpenseModal from "../../components/Trips/UpdateExpenseModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TripGeneralInfo from "../GeneralInfo/TripGeneralInfo";
import {
  faFilter,
  faTrash,
  faPlane,
  faBed,
  faTaxi,
  faBus,
  faUtensils,
  faWineGlass,
  faMonument,
  faTicket,
  faBagShopping,
  faGasPump,
  faBasketShopping,
  faNoteSticky,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";
import Dropdown from "react-bootstrap/Dropdown";
library.add(
  faFilter,
  faTrash,
  faPlane,
  faBed,
  faTaxi,
  faBus,
  faUtensils,
  faWineGlass,
  faMonument,
  faTicket,
  faBagShopping,
  faGasPump,
  faBasketShopping,
  faNoteSticky
);

const { confirm } = Modal;
class TripBudget extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      trip: {},
      totalBudget: {},
      graphData: [],
      expenseData: [],
      dataLoaded: false,
      tripIdLoaded: false,
      currentFilter: 0,
      tripUser: null,
    };
  }
  componentDidMount() {
    const { id } = this.props.params;
    //console.log("id:", id);
    axios
      .get(`http://localhost:8080/trip/general/` + id)
      .then((res) => {
        const tripData = res.data;
        this.setState({
          trip: tripData,
          dataLoaded: true,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
    axios
      .get(`http://localhost:8080/api/expense/total/` + id)
      .then((res) => {
        const totalExpense = res.data;
        this.setState({
          totalBudget: totalExpense,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
    axios
      .get(`http://localhost:8080/api/expense/graph/` + id)
      .then((res) => {
        const data = res.data;
        this.setState({
          graphData: data,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
    axios
      .get(`http://localhost:8080/api/expense/` + id + "/0")
      .then((res) => {
        const data = res.data;
        this.setState({
          expenseData: data,
        });
        axios
          .get(
            `http://localhost:8080/api/expense/user/` + this.state.trip.tripId
          )
          .then((res) => {
            const data = res.data;
            this.setState({
              tripUser: data,
              tripIdLoaded: true,
            });
          })
          .catch(function (error) {
            console.log(error);
            return Promise.reject(error);
          });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
  }

  refreshHandler = () => {
    const id = window.location.href.split("/")[4];
    axios
      .get(`http://localhost:8080/api/expense/total/` + id)
      .then((res) => {
        const totalExpense = res.data;
        this.setState({
          totalBudget: totalExpense,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
    axios
      .get(`http://localhost:8080/api/expense/graph/` + id)
      .then((res) => {
        const data = res.data;
        this.setState({
          graphData: data,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
    axios
      .get(
        `http://localhost:8080/api/expense/` +
          id +
          "/" +
          this.state.currentFilter
      )
      .then((res) => {
        const data = res.data;
        this.setState({
          expenseData: data,
        });
      })
      .catch(function (error) {
        console.log(error);
        return Promise.reject(error);
      });
  };

  toLongDate = (date) => {
    var options = {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    };
    var today = new Date(date);
    return today.toLocaleDateString("vi", options);
  };

  //Filter
  filterChanged = (event) => {
    const id = window.location.href.split("/")[4];
    const filterId = event.currentTarget.id;
    const filterDropdown = document.getElementById("filterDropdown");
    filterDropdown.innerHTML = " Filter: " + event.currentTarget.name;
    var elems = document.querySelectorAll(".active");
    [].forEach.call(elems, function (el) {
      el.classList.remove("active");
    });
    event.currentTarget.className += " active";
    axios
      .get(`http://localhost:8080/api/expense/` + id + "/" + filterId)
      .then((res) => {
        const data = res.data;
        this.setState({
          expenseData: data,
          currentFilter: filterId,
        });
      })
      .catch(function (error) {
        return Promise.reject(error);
      });
  };

  //Delete Expense
  deleteExpense = async (event) => {
    const filter = this.state.currentFilter;
    const expenseId = event.currentTarget.id;
    confirm({
      title: "Bạn có chắc mình muốn xóa chi tiêu này không?",
      content: "Chi tiêu này sẽ bị xóa",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        const id = window.location.href.split("/")[4];
        await axios.delete(
          `http://localhost:8080/api/expense/` + expenseId,
          {}
        );
        //window.location.reload();
        this.refreshHandler();
      },
      onCancel() {},
    });
  };

  render() {
    const formatter = new Intl.NumberFormat("vi", {
      style: "currency",
      currency: "VND",
    });
    //Breakdown Data
    const graphData = this.state.graphData;
    const categoryData = [];
    const expenseData = [];
    graphData.forEach((entry, index) => {
      categoryData.push(entry.name);
      expenseData.push(entry.amount);
    });
    let graphProps = {
      categoryData: categoryData,
      expenseData: expenseData,
    };
    //Calculate % Expense and display Progress Bar
    const expenseRate =
      Math.round(
        (this.state.totalBudget / this.state.trip.budget) * 100 * 100
      ) / 100;
    const exceedExpense = Math.round((expenseRate - 100) * 100) / 100;
    const progressBar = [];
    if (expenseRate >= 100) {
      progressBar.push(<Progress className={style.progressBar} trailColor="rgb(219, 219, 219)" strokeColor="rgb(255, 99, 132)" showInfo={false} percent={expenseRate}/>)
      progressBar.push(<span className={style.budgetExceed}>Bạn đã quá ngân sách {exceedExpense}%</span>)
    }
    else if (expenseRate > 80) {
      progressBar.push(<Progress className={style.progressBar} trailColor="rgb(219, 219, 219)" strokeColor="rgb(255, 182, 10)" showInfo={false} percent={expenseRate}/>)
      progressBar.push(<span className={style.budgetWarning}>Bạn đang ở {expenseRate}% ngân sách</span>)
    }
    else if (expenseRate <= 80) {
      progressBar.push(<Progress className={style.progressBar} trailColor="rgb(219, 219, 219)" strokeColor="rgb(82, 196, 26)" showInfo={false} percent={expenseRate}/>)
      progressBar.push(<span className={style.budgetNormal}>Bạn đang ở {expenseRate}% ngân sách</span>)
    }
    //Expenses
    const expenseBox = [];
    const expenseBoxData = this.state.expenseData;
    expenseBoxData.forEach((entry, index) => {
      expenseBox.push(
        <MDBCardBody className={style.expenseBox}>
          <MDBRow className={style.expenseBoxRow}>
            <MDBCol md={1} className={style.expenseBoxIcon}>
              <FontAwesomeIcon icon={entry.icon} />
            </MDBCol>
            <MDBCol md={6} className={style.expenseBoxMid}>
              <b>{entry.name}</b>
              <br />
              {entry.description}
            </MDBCol>
            <MDBCol md={3} className={style.expenseBoxAmount}>
              {formatter.format(entry.amount)}
            </MDBCol>
            <MDBCol
              md={1}
              onClick={this.updateExpense}
              id={entry.expenseId}
              className={style.expenseBoxDelete}
            >
              <UpdateExpenseModal
                data={entry}
                refreshHandler={() => this.refreshHandler()}
              />
            </MDBCol>
            <MDBCol
              md={1}
              onClick={this.deleteExpense}
              id={entry.expenseId}
              className={style.expenseBoxDelete}
            >
              <FontAwesomeIcon icon="trash" />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      );
    });
    //Check user

    if (!this.state.dataLoaded)
    return (
      <div>
        <h1> Vui lòng đợi.... </h1>{" "}
      </div>
    );
    if (this.state.tripIdLoaded)
      if (localStorage.getItem("id") == null)
        return (
          <div className={style.errorText}>
            <h1> Đăng nhập để quản lí chi phí </h1>{" "}
          </div>
        );
      else if (localStorage.getItem("id") != this.state.tripUser)
        return (
          <div className={style.errorText}>
            <h1> Không thể quản lí chi phí của một chuyến đi không phải của bạn </h1>{" "}
          </div>
        );
    document.title = this.state.trip.name + " | Tripplanner";
    var imgUrl = this.state.trip.image;
    return (
      <div>
        <TripGeneralInfo />
        <TripDetailTabs></TripDetailTabs>
        <MDBContainer className={style.mainContainer}>
          <h1>Ngân sách chuyến đi</h1><br/>
          <MDBCard className={style.budgetContainer}>
            <MDBCardBody>
              <span className={style.expenseText}>Chi tiêu: {formatter.format(this.state.totalBudget)}</span>
              <span className={style.budgetText}>Ngân sách: {formatter.format(this.state.trip.budget)}</span>
              <br/>{progressBar}
              <ModalGraph props={graphProps}/>
            </MDBCardBody>
          </MDBCard><br/>
          <h2>Các chi tiêu</h2>
          <MDBRow className={style.btnGroup}>
            <MDBCol md={4} className={style.expenseAdd}>
              <AddExpenseModal refreshHandler={() => this.refreshHandler()} />
            </MDBCol>
            <MDBCol md={4} className={style.expenseFilter}>
              <Dropdown>
                <Dropdown.Toggle variant="info">
                  <FontAwesomeIcon icon="filter"/><span id="filterDropdown"> Bộ lọc: Theo ngày</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.filterChanged} id={0} active name="By date">Theo ngày</Dropdown.Item>
                  <Dropdown.Item onClick={this.filterChanged} id={1} name="Amount: High to low">Giá: Cao đến thấp</Dropdown.Item>
                  <Dropdown.Item onClick={this.filterChanged} id={2} name="Amount: Low to high">Giá: Thấp đến cao</Dropdown.Item>
                  <Dropdown.Item onClick={this.filterChanged} id={3} name="By category">Theo danh mục</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </MDBCol>
          </MDBRow>
          <br />
          {expenseBox}
        </MDBContainer>
      </div>
    );
  }
}

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}
export default withParams(TripBudget);
