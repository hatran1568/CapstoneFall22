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
  MDBBtn,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import style from "./ListTypes.module.css";
import axios from "../../api/axios";
import React, { useState, useEffect } from "react";

function ListTypes(props) {
  const [result, setResult] = useState(false);
  const [showShow, setShowShow] = useState(false);
  const [select, setSelect] = useState("ALL");
  const toggleShow = (e) => {
    setShowShow(!showShow);
  };

  const getType = () => {
    axios
      .get("http://localhost:8080/search/type", {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => response.data)
      .catch(() => setResult(false))
      .then((data) => setResult(data));
  };

  const callBackAll = (e) => {
    props.onTypeChange(false);
    setSelect("ALL");
  };
  const callBack = (e) => {
    props.onTypeChange(e.target.innerText.split(" ").join("_"));
    setSelect(e.target.innerText.split(" ").join("_"));
    console.log(select);
  };
  useEffect(getType, [result != false]);
  return (
    <MDBListGroup style={{ cursor: "pointer" }} flush className="mx-3 mt-4">
      <MDBRipple rippleTag="span">
        <MDBListGroupItem
          onClick={callBackAll}
          action
          className={
            "border-0 border-bottom rounded rounded " +
            (select.localeCompare("ALL") == 0 && style.active)
          }
        >
          ALL
        </MDBListGroupItem>
      </MDBRipple>
      {result &&
        result.map(
          (item) =>
            (item == "BLOG" || item == "DESTINATION") && (
              <MDBRipple rippleTag="span">
                <MDBListGroupItem
                  onClick={callBack}
                  action
                  className={
                    "border-0 border-bottom rounded rounded " +
                    (select.localeCompare(item) == 0 && style.active)
                  }
                >
                  {item.split("_").join(" ")}
                </MDBListGroupItem>
              </MDBRipple>
            )
        )}
      <MDBRipple rippleTag="span">
        <MDBListGroupItem
          onClick={toggleShow}
          className={"border-0 border-bottom rounded rounded "}
        >
          POI
        </MDBListGroupItem>
      </MDBRipple>

      {result &&
        result.map(
          (item) =>
            item != "BLOG" &&
            item != "DESTINATION" && (
              <MDBRipple rippleTag="span">
                <MDBListGroupItem
                  onClick={callBack}
                  action
                  className={
                    (showShow == true ? style.show : style.hide) +
                    " border-0 border-bottom rounded rounded " +
                    style.poi +
                    " " +
                    (select.localeCompare(item) == 0 && style.active)
                  }
                >
                  {item.split("_").join(" ")}
                </MDBListGroupItem>
              </MDBRipple>
            )
        )}
    </MDBListGroup>
  );
}
export default ListTypes;
