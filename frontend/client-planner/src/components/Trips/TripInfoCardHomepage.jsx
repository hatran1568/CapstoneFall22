import { MDBCard, MDBCardImage, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import { React } from "react";
import style from "./TripInfoCardHomepage.module.css";

function TripInfoCardHomepage() {
  return (
    <MDBCard className={style.card}>
      <MDBCardImage
        className={style.img}
        src="https://mdbootstrap.com/img/new/standard/nature/111.webp"
        alt="..."
      />
      <div className={style.caption}>
        <p>3 days in Hanoi ahchcascnvsdvnj</p>
        <p style={{ fontSize: "1vw" }}>Aug 8, 2022 - Aug 10, 2022</p>
      </div>
      <div className={style.description}>
        <div>
          <b>Budget:</b> 10000 VND
        </div>
        <div>
          <b>Last updated:</b> 5 Oct 2022
        </div>
      </div>
      <MDBBtn tag="a" color="none" className={`${style.deleteButton} m-1 mt-4`}>
        <MDBIcon far icon="trash-alt" size="lg" />
      </MDBBtn>
    </MDBCard>
  );
}

export default TripInfoCardHomepage;
