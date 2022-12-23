import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
} from "mdb-react-ui-kit";
import PersonIcon from "@mui/icons-material/Person";
import SearchBar from "../searchBar/POIAndDestinationSearchBar";
import AuthProvider from "../../context/AuthProvider";
import style from "./NavBar.module.css";
import useAuth from "../../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";

const NavBar = () => {
  const [windowDimenion, detectHW] = useState({
    winWidth: window.innerWidth,
    winHeight: window.innerHeight,
  });

  const pathname = window.location.pathname;
  const isLogged = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    window.location.href = "/";
  };

  const detectSize = () => {
    detectHW({
      winWidth: window.innerWidth,
      winHeight: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", detectSize);

    return () => {
      window.removeEventListener("resize", detectSize);
    };
  }, [windowDimenion]);

  var searchBar = [];
  if (windowDimenion.winWidth > 575) {
    searchBar.push(
      <>
        <MDBNavbarBrand href="/" className={`me-0 ${style.name}`}>
          <p className="mb-0 d-flex align-items-center">
            {/* <span className="fs-3 me-2">TPS</span> */}
            <img src="../img/default/T.png" alt="" className={style.logo} />
            <span className="fs-5 text-muted">Itinerary planner</span>
          </p>
        </MDBNavbarBrand>

        <MDBNavbarNav className="justify-content-center">
          <MDBNavbarItem>
            <SearchBar key={"search"} />
          </MDBNavbarItem>
        </MDBNavbarNav>
      </>
    );
  } else {
    searchBar.push(
      <MDBNavbarNav className="justify-content-center" fullWidth={false}>
        <MDBNavbarItem>
          <SearchBar />
        </MDBNavbarItem>
      </MDBNavbarNav>
    );
  }

  if (window)
    return (
      <MDBNavbar expand="sm" light className={`${style.navBar}`}>
        <MDBContainer fluid className={style.container}>
          {searchBar}

          <MDBNavbarNav right fullWidth={false}>
            {isLogged ? (
              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag="a" className="nav-link link-dark">
                    <PersonIcon />
                  </MDBDropdownToggle>
                  <MDBDropdownMenu style={{ padding: 0 }}>
                    <MDBDropdownItem link href="/profile">
                      Hồ sơ cá nhân
                    </MDBDropdownItem>
                    <MDBDropdownItem link href="/change-password">
                      Đổi mật khẩu
                    </MDBDropdownItem>
                    <MDBDropdownItem link href="/" onClick={handleLogout}>
                      Đăng xuất
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem>
            ) : (
              <MDBNavbarItem>
                <MDBBtn style={{ width: 150 }} href="/login" color="info">
                  Đăng nhập
                </MDBBtn>
              </MDBNavbarItem>
            )}
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>
    );
};

export default NavBar;
