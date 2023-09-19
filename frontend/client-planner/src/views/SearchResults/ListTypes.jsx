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
      .get("http://localhost:8080/location/search/type", {
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
    props.onTypeChange(
      e.target.getAttribute("original-name").split(" ").join("_"),
    );
    setSelect(e.target.getAttribute("original-name").split(" ").join("_"));
    console.log(select);
  };
  const vietCategories = {
    DESTINATION: "Điểm đến",
    BLOG: "Blog",
    ART_AND_CULTURE: "Văn hóa, nghệ thuật",
    OUTDOORS: "Hoạt động ngoài trời",
    RELIGION: "Tôn giáo",
    HISTORIC_SIGHTS: "Lịch sử",
    MUSEUMS: "Bảo tàng",
    SPAS_AND_WELLNESS: "Spa & Sức khỏe",
    SHOPPING: "Mua sắm",
    BEACHES: "Bãi biển",
    NIGHTLIFE: "Hoạt động đêm",
    HOTELS: "Khách sạn",
    RESTAURANTS: "Nhà hàng",
    ENTERTAINMENTS: "Giải trí",
  };
  useEffect(getType, [result != false]);
  return (
    <MDBListGroup style={{ cursor: "pointer" }} flush className="mx-3 mt-0">
      <MDBRipple rippleTag="span">
        <MDBListGroupItem
          onClick={callBackAll}
          action
          className={
            "border-0 border-bottom rounded rounded " +
            (select.localeCompare("ALL") == 0 && style.active)
          }
        >
          Tất cả
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
                  original-name={item.split("_").join(" ")}
                >
                  {vietCategories[item]}
                </MDBListGroupItem>
              </MDBRipple>
            ),
        )}
      <MDBRipple rippleTag="span">
        <MDBListGroupItem
          onClick={toggleShow}
          className={"border-0 border-bottom rounded rounded "}
        >
          Địa điểm
        </MDBListGroupItem>
      </MDBRipple>

      {result &&
        result.map((item) =>
          item != "BLOG" && item != "DESTINATION" ? (
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
                original-name={item.split("_").join(" ")}
              >
                {vietCategories[item]}
              </MDBListGroupItem>
            </MDBRipple>
          ) : null,
        )}
    </MDBListGroup>
  );
}
export default ListTypes;
