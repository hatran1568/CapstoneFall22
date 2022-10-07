import React, { useState } from "react";
import { MDBCard, MDBCardBody, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import "./SearchBar.css";

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState("");

    const POIs = [
        { name: "hanoi" },
        { name: "thai binh" },
        { name: "nam dinh" },
        { name: "hai phong" },
        { name: "da nang" },
        { name: "can tho" },
    ];

    const list = POIs.filter((p) => {
        if (searchInput === "") {
            return p;
        } else if (p.name.toLowerCase().includes(searchInput.toLowerCase())) {
            return p;
        }
    });

    return (
        <MDBCard>
            <MDBCardBody>
                <MDBRow>
                    <MDBCol>
                        <MDBInput
                            type='search'
                            placeholder='Type something...'
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    {list.map((poi, index) => {
                        return (
                            <div key={index}>
                                <p>{poi.name}</p>
                            </div>
                        );
                    })}
                </MDBRow>
            </MDBCardBody>
        </MDBCard>
    );
};

export default SearchBar;
