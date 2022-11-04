import { useState, useEffect, Children } from "react";
import ResultList from "./ResultList";
import { MDBInput, MDBBtn, MDBIcon, MDBInputGroup } from "mdb-react-ui-kit";
import style from "./POIAndDestinationSearchBar.module.css";
import { InputAdornment, Input } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function POIAndDestinationSearchBar(Children) {
  const [text, setText] = useState("");

  return (
    <div className={style.container}>
      <MDBInputGroup className={style.searchBarGroup}>
        <Input
          inputProps={{
            style: {
              paddingLeft: 25,
            },
          }}
          startAdornment={
            <InputAdornment className={style.icon} position="start">
              <SearchIcon />
            </InputAdornment>
          }
          /*className={style.searchBar}*/
          onChange={(e) => setText(e.target.value)}
          placeholder="Search"
          label="Search"
          id="form1"
          type="text"
          className={style.searchBar}
        />
      </MDBInputGroup>

      <ResultList text={text}></ResultList>
    </div>
  );
}
export default POIAndDestinationSearchBar;
