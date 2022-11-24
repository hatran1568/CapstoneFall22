import { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  MDBDropdownMenu,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import style from "./ResultList.module.css";
import "./override.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMapLocationDot,
  faBlog,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
function ResultList(props) {
  const [result, setResult] = useState(false);
  const [select, setSelect] = useState(0);
  const getResult = () => {
    axios
      .get("http://localhost:8080/location/search/all/" + props.text, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => response.data)
      .catch(() => setResult(false))
      .then((data) => setResult(data));
  };
  useEffect(getResult, [props.text]);
  return (
    <MDBListGroup className={style.list}>
      {result &&
        result.map((item, index) => (
          <a
            className={style.link}
            href={
              item.type == "DESTINATION"
                ? "http://localhost:3000/Destination?id=" + item.id
                : item.type == "BLOG"
                ? "#"
                : "http://localhost:3000/poi?id=" + item.id
            }
          >
            {" "}
            <MDBListGroupItem
              onMouseOver={() => setSelect(index)}
              onMouseLeave={() => setSelect(0)}
              active={select == index}
              className={style.item + "px-3 mx-0 square border"}
              color="light"
              key={index}
            >
              {" "}
              <div className={style.icon}>
                <FontAwesomeIcon
                  icon={
                    item.type == "DESTINATION"
                      ? faLocationDot
                      : item.type == "POI"
                      ? faMapLocationDot
                      : faBlog
                  }
                />
              </div>{" "}
              &nbsp; &nbsp; {item.name}
            </MDBListGroupItem>
          </a>
        ))}
      {props.text && (
        <a className={style.link} href={"/searchResults?search=" + props.text}>
          <MDBListGroupItem
            onMouseOver={() => setSelect(-1)}
            onMouseLeave={() => setSelect(0)}
            active={select == -1}
            className={style.item + " px-3 mx-0 square border"}
          >
            <FontAwesomeIcon
              className={style.icon}
              icon={faSearch}
            ></FontAwesomeIcon>{" "}
            &nbsp; &nbsp; See more result for "{props.text}"
          </MDBListGroupItem>
        </a>
      )}
    </MDBListGroup>
  );
}
export default ResultList;
