import React from "react";
import { ButtonRibbon, Caption, Card, CardMedia } from "./TripInfoCardStyle";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
function TripInfoCard(trip) {
  return (
    <Card>
      <CardMedia>
        <img src="https://picsum.photos/id/10/600/400"></img>
        <Caption>
          <p>{trip.name}</p>
          <p style={{ fontSize: "1.1vw" }}>Aug 8, 2022 - Aug 10, 2022</p>
        </Caption>
        <ButtonRibbon>
          <MDBBtn tag="a" color="none" style={{ color: "white" }}>
            <i className="fas fa-solid fa-trash fa-lg"></i>
          </MDBBtn>
        </ButtonRibbon>
      </CardMedia>
    </Card>
  );
}

export default TripInfoCard;
