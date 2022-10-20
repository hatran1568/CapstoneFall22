import React, { useEffect, useState } from "react";
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
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

const POISearchBar = () => {
    const [searchInput, setSearchInput] = useState("");
    const [results, setResults] = useState(false);
    const [selected, setSelected] = useState(0);
    const getResults = () => {
        axios
            .get("http://localhost:8080/search/poi/" + searchInput, {
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => response.data)
            .catch(() => setResults(false))
            .then((data) => setResults(data));
    };
    useEffect(getResults, [searchInput]);

    return (
        <div>
            <MDBInputGroup>
                <MDBInput
                    type='text'
                    placeholder='Search'
                    color='light'
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                />
            </MDBInputGroup>

            <MDBListGroup>
                {results &&
                    results.map((item, index) => (
                        <MDBListGroupItem
                            onMouseOver={() => setSelected(index)}
                            onMouseLeave={() => setSelected(0)}
                            active={selected === index}
                            key={index}
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

export default POISearchBar;
