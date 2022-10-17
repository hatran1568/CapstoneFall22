import React from "react";
import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import style from "./HomePage.module.css";
import POISearchBar from "../../components/POISearchBar/POISearchBar";

function HomePage() {
    return (
        <MDBContainer>
            <h2 className='text-center mt-1'>Goodies from our services</h2>
            <MDBRow>
                <MDBCol size="6"></MDBCol>
                <MDBCol size="6"></MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol size="6"></MDBCol>
                <MDBCol size="6"></MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol size="6"></MDBCol>
                <MDBCol size="6"></MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default HomePage;
