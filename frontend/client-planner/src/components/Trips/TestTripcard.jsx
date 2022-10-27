import { MDBCard, MDBContainer } from "mdb-react-ui-kit";
import { React } from "react";
import TripInfoCardHomepage from "./TripInfoCardHomepage";

function TestTripcard() {
  return (
    <MDBContainer className="d-flex flex-row justify-content-center align-items-center">
      <TripInfoCardHomepage></TripInfoCardHomepage>
      <TripInfoCardHomepage></TripInfoCardHomepage>

      <TripInfoCardHomepage></TripInfoCardHomepage>
    </MDBContainer>
  );
}

export default TestTripcard;
