import React, { useState } from "react";
import { MDBCard, MDBCardBody, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import "./POISearchBar.css";

const POISearchBar = () => {
    const [searchInput, setSearchInput] = useState("");

    // Dummy data for demo purposes, would be updated later
    const POIs = [
        { name: "ha noi" },
        { name: "thai binh" },
        { name: "nam dinh" },
        { name: "hai phong" },
        { name: "da nang" },
        { name: "can tho" },
    ];

    const list = POIs.filter((p) => {
        if (searchInput !== "" && p.name.toLowerCase().includes(searchInput.toLowerCase())) {
            return p;
        }
        return null;
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
                            // This one still needs a link tag for poi details, will be added later
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

export default POISearchBar;
