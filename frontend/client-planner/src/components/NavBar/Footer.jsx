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
    <MDBFooter bgColor="dark" className="text-lg-left mt-5">
      <MDBContainer className="p-4" style={{ color: "white" }}>
        <MDBRow>
          <MDBCol lg="8" md="12" className="mb-md-0">
            <h6 style={{ color: "whitesmoke" }} className="text-uppercase mb-4">
              Về chúng tôi
            </h6>

            <p style={{ fontSize: "14px", marginRight: "20%" }}>
              Trip Planner System, được làm bởi nhóm SEP490_G2 cho dự án Final
              Capstone ngành Công nghệ phần mềm của Đại học FPT học kỳ Fall
              2022, là một ứng dụng web được phát triển với mục đích cung cấp
              nền tảng để người sử dụng lên kế hoạch trước và chia sẻ chuyến đi
              du lịch của họ với người dùng khác.
            </p>
          </MDBCol>

          <MDBCol lg="4" md="12" className=" mb-md-0">
            <h6 style={{ color: "whitesmoke" }} className="text-uppercase mb-4">
              Thông tin liên lạc
            </h6>

            <p style={{ fontSize: "14px" }}>
              <MDBIcon icon="home" className="me-2" />
              Đại học FPT, Hòa Lạc, Hà Nội
            </p>
            <p style={{ fontSize: "14px" }}>
              <MDBIcon icon="envelope" className="me-2" />
              tripplanner@gmail.com
            </p>
            <p style={{ fontSize: "14px" }}>
              <MDBIcon icon="phone" className="me-2" />
              083 643 3574
            </p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </MDBFooter>
  );
}

export default Footer;
