import React, { useEffect, useState, useRef, memo } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBInputGroup,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import style from "./POISearchBar.module.css";
import axios from "../../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapLocationDot,
  faCircleMinus,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

import { Input, OutlinedInput } from "@mui/material";

const POISearchBar = (props) => {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState(false);
  const [selected, setSelected] = useState(0);
  const [selectedPOI, setSelectedPOI] = useState("");
  const getResults = () => {
    if (searchInput.trim().length > 0) {
      axios
        .get("http://localhost:8080/search/poi/" + searchInput, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => response.data)
        .catch(() => setResults(false))
        .then((data) => setResults(data));
    }
  };
  useEffect(getResults, [searchInput]);
  const wrapperRef = useRef(null);
  const handleRemovePOI = () => {
    document.getElementById("inputSearchString").placeholder =
      props.placeholder == null
        ? "Find a place of interest"
        : props.placeholder;
    document.getElementById("inputSearchString").value = "";

    setSearchInput("");
    setResults([]);
    setSelectedPOI("");
    props.POISelected("");
  };
  //useOutsideAlerter(wrapperRef);
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        document.getElementById("inputSearchString").value = "";
        setSearchInput("");
        setResults([]);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  return (
    <div
      className={
        ` ${style.container}` +
        " " +
        (props.customStyle == null ? "" : props.customStyle)
      }
      ref={wrapperRef}
    >
      <MDBInputGroup>
        <OutlinedInput
          type="text"
          placeholder={
            props.placeholder == null
              ? "Hãy tìm một địa điểm"
              : props.placeholder
          }
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          className={style.input}
          fullWidth={true}
          size="small"
          id="inputSearchString"
        />
        <button type="button" onClick={handleRemovePOI} className={style.clear}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
      </MDBInputGroup>

      <MDBListGroup className={style.list}>
        {results &&
          results.map((item, index) => (
            <MDBListGroupItem
              onMouseOver={() => setSelected(index)}
              onMouseLeave={() => setSelected(0)}
              active={selected === index}
              key={index}
              onClick={() => {
                document.getElementById("inputSearchString").placeholder =
                  item.name;
                document.getElementById("inputSearchString").value = "";

                setSearchInput("");
                setResults([]);
                setSelectedPOI(item);
                props.POISelected(item);
              }}
              className={style.listItem}
            >
              <div className={style.icon}>
                <FontAwesomeIcon icon={faMapLocationDot} />
              </div>
              {item.name}
            </MDBListGroupItem>
          ))}
      </MDBListGroup>
    </div>
  );
};
/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        alert("You clicked outside of me!");
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
export default POISearchBar;
