import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import { React } from "react";

function Footer() {
  return (
    <MDBFooter bgColor="dark" className=" text-lg-left mt-5">
      <MDBContainer className="p-4" style={{ color: "white" }}>
        <MDBRow>
          <MDBCol lg="8" md="12" className="mb-md-0">
            <h6 style={{ color: "whitesmoke" }} className="text-uppercase mb-4">
              About us
            </h6>

            <p style={{ fontSize: "14px", marginRight: "20%" }}>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste
              atque ea quis molestias. Fugiat pariatur maxime quis culpa
              corporis vitae repudiandae aliquam voluptatem veniam, est atque
              cumque eum delectus sint!
            </p>
          </MDBCol>

          <MDBCol lg="4" md="12" className=" mb-md-0">
            <h6 style={{ color: "whitesmoke" }} className="text-uppercase mb-4">
              Our contacts
            </h6>

            <p style={{ fontSize: "14px" }}>
              <MDBIcon icon="home" className="me-2" />
              FPT University, Hoa Lac, Hanoi
            </p>
            <p style={{ fontSize: "14px" }}>
              <MDBIcon icon="envelope" className="me-2" />
              tripplanner@gmail.com
            </p>
            <p style={{ fontSize: "14px" }}>
              <MDBIcon icon="phone" className="me-2" />
              083 643 3574
            </p>
            <p style={{ fontSize: "14px" }}>
              <MDBIcon icon="print" className="me-2" />
              083 643 3574
            </p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </MDBFooter>
  );
}

export default Footer;
