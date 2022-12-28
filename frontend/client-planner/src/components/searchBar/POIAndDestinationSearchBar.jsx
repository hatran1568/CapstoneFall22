import { useState, useEffect, Children, useRef } from "react";
import ResultList from "./ResultList";
import { MDBInput, MDBBtn, MDBIcon, MDBInputGroup } from "mdb-react-ui-kit";
import style from "./POIAndDestinationSearchBar.module.css";
import { InputAdornment, Input } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function POIAndDestinationSearchBar(Children) {
  const [text, setText] = useState("");
  const [showResults, setShowResults] = useState(true);
  const wrapperRef = useRef(null);
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
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
    <div className={style.container} ref={wrapperRef}>
      <MDBInputGroup className={style.searchBarGroup}>
        <Input
          inputProps={{
            style: {
              paddingLeft: 25,
            },
            maxLength: 200,
          }}
          startAdornment={
            <InputAdornment className={style.icon} position="start">
              <SearchIcon />
            </InputAdornment>
          }
          /*className={style.searchBar}*/
          onChange={(e) => {
            setText(e.target.value);
            setShowResults(true);
          }}
          placeholder="Tìm kiếm"
          label="Search"
          id="form1"
          type="text"
          className={style.searchBar}
          onFocus={(e) => {
            setShowResults(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.target.value.trim().length > 0) {
              window.location.href =
                "/searchResults?search=" + event.target.value.trim();
            }
          }}
        />
      </MDBInputGroup>
      {showResults ? <ResultList text={text}></ResultList> : null}
    </div>
  );
}
export default POIAndDestinationSearchBar;
