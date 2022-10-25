import React, { Component } from "react";
import TripDetailTabs from "./TripDetailTabs";
import style from "./TripBudget.module.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';
import ModalGraph from "../../components/ModalGraph"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fontawesome from '@fortawesome/fontawesome'
import { faPlane, faBed, faTaxi, faBus, faUtensils, faWineGlass, faMonument, faTicketAlt, faShoppingBag, faGasPump, faShoppingBasket, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBRow,
    MDBCol,
    MDBRadio,
    MDBBtnGroup
  } from "mdb-react-ui-kit";
import Dropdown from 'react-bootstrap/Dropdown';
fontawesome.library.add(faPlane, faBed, faTaxi, faBus, faUtensils, faWineGlass, faMonument, faTicketAlt, faShoppingBag, faGasPump, faShoppingBasket, faStickyNote);
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
    };
  }
  componentDidMount() {
    const { id } = this.props.params;
    //console.log("id:", id);
    axios.get(`http://localhost:8080/trip/` + id).then((res) => {
      const tripData = res.data;
      this.setState({
        trip: tripData,
        dataLoaded: true,
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    axios.get(`http://localhost:8080/api/expense/total/` + id).then((res) => {
      const totalExpense = res.data;
      this.setState({
        totalBudget: totalExpense
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    axios.get(`http://localhost:8080/api/expense/graph/` + id).then((res) => {
      const data = res.data;
      this.setState({
        graphData: data
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
    axios.get(`http://localhost:8080/api/expense/` + id + "/0").then((res) => {
      const data = res.data;
      this.setState({
        expenseData: data
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
  }
  
  toLongDate = (date) => {
    var options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    var today = new Date(date);
    return today.toLocaleDateString("en-US", options);
  };
  
  //Filter
  filterChanged = (event) => {
    const id = window.location.href.split('/')[4];
    const filterDropdown = document.getElementById("filterDropdown");
    filterDropdown.innerHTML = "Filter: " + event.currentTarget.name;
    var elems = document.querySelectorAll(".active");
    [].forEach.call(elems, function(el) {
      el.classList.remove("active");
    });
    event.currentTarget.className += " active";
    axios.get(`http://localhost:8080/api/expense/` + id + "/" + event.currentTarget.id).then((res) => {
      const data = res.data;
      this.setState({
        expenseData: data
      });
    }).catch(
      function (error) {
        console.log(error)
        return Promise.reject(error)
      }
    );
  }
  
  render() {
    const formatter = new Intl.NumberFormat('vi', {
      style: 'currency',
      currency: 'VND',
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
      expenseData: expenseData
    }
    //Calculate % Expense and display Progress Bar
    const expenseRate = Math.round((this.state.totalBudget / this.state.trip.budget) * 100 * 100) / 100;
    const exceedExpense = Math.round((expenseRate - 100) * 100) / 100;
    const progressBar = [];
    if (expenseRate >= 100) {
      progressBar.push(<ProgressBar animated striped variant="danger" now={expenseRate}/>)
      progressBar.push(<span className={style.budgetExceed}>You have exceeded the budget by {exceedExpense}%</span>)
    }
    else if (expenseRate > 80) {
      progressBar.push(<ProgressBar animated striped variant="warning" now={expenseRate}/>)
      progressBar.push(<span className={style.budgetWarning}>You are at {expenseRate}% of the set budget</span>)
    }
    else if (expenseRate <= 80) {
      progressBar.push(<ProgressBar animated striped variant="success" now={expenseRate}/>)
      progressBar.push(<span className={style.budgetNormal}>You are at {expenseRate}% of the set budget</span>)
    }
    //Expenses
    const expenseBox = [];
    const expenseBoxData = this.state.expenseData;
    expenseBoxData.forEach((entry, index) => {
      expenseBox.push(
        <MDBCardBody className={style.expenseBox}>
          <MDBRow className={style.expenseBoxRow}>
            <MDBCol md={1} className={style.expenseBoxIcon}>
              <FontAwesomeIcon icon={entry.icon}/>
            </MDBCol>
            <MDBCol md={8} className={style.expenseBoxMid}>
              <b>{entry.name}</b><br/>{entry.description}
            </MDBCol>
            <MDBCol md={3} className={style.expenseBoxAmount}>
              {formatter.format(entry.amount)}
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      );
    });
    

    if (!this.state.dataLoaded)
    return (
      <div>
        <h1> Please wait some time.... </h1>{" "}
      </div>
    );
    return (
      <div>
        <div className={style.tripImage}>
          <div className={style.infoBox}>
            <h1 className={style.planTitle}>{this.state.trip.name}</h1>
            <h2 className={style.dates}>
              {this.toLongDate(this.state.trip.startDate)} -{" "}
              {this.toLongDate(this.state.trip.endDate)}
            </h2>
          </div>
        </div>
        <TripDetailTabs></TripDetailTabs>
        <MDBContainer className={style.mainContainer}>
          <h1>Trip Budget</h1>
          <MDBCard className={style.budgetContainer}>
            <MDBCardBody>
              <span className={style.expenseText}>Expenses: {formatter.format(this.state.totalBudget)}</span>
              <span className={style.budgetText}>Set Budget: {formatter.format(this.state.trip.budget)}</span>
              <br/>{progressBar}
              <ModalGraph props={graphProps}/>
            </MDBCardBody>
          </MDBCard><br/>
          <h2>Expenses</h2>
          <MDBContainer className={style.expenseFilter}>
            <Dropdown>
              <Dropdown.Toggle variant="info" id="filterDropdown">
                Filter: By Date
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={this.filterChanged} id={0} active name="By date">By date</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={1} name="Amount: High to low">Amount: High to low</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={2} name="Amount: Low to high">Amount: Low to high</Dropdown.Item>
                <Dropdown.Item onClick={this.filterChanged} id={3} name="By category">By category</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </MDBContainer>
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