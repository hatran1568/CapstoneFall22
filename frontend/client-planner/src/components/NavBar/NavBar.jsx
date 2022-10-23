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
} from "mdb-react-ui-kit";
import PersonIcon from "@mui/icons-material/Person";
import SearchBar from "../searchBar/POIAndDestinationSearchBar";
import AuthProvider from "../../context/AuthProvider";
import style from "./NavBar.module.css";
import useAuth from "../../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";

const NavBar = () => {
  const pathname = window.location.pathname;
  const isLogged = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    window.location.href = "/";
  };
  return (
    <MDBNavbar expand="lg" light className={style.navBar}>
      <MDBContainer fluid>
        <MDBNavbarBrand href="/" className="me-0">
          <p className="mb-0 d-flex align-items-center">
            <span className="fs-3 me-2">TPS</span>
            <span className="fs-5 text-muted">Itinerary planner</span>
          </p>
        </MDBNavbarBrand>

        <MDBNavbarNav>
          <MDBNavbarItem>
            <MDBNavbarLink className={pathname === "/" ? "active" : ""} href='/'></MDBNavbarLink>
          </MDBNavbarItem>

          {/*<MDBNavbarItem>
                        <MDBNavbarLink className={pathname === "/login" ? "active" : ""} href='/login'>
                            Login
                        </MDBNavbarLink>
                    </MDBNavbarItem>*/}
        </MDBNavbarNav>

        <MDBNavbarNav center="true">
          <MDBNavbarItem>
            <SearchBar />
          </MDBNavbarItem>
        </MDBNavbarNav>

        <MDBNavbarNav right fullWidth={false}>
          {isLogged ? (
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag="a" className="nav-link link-dark">
                  <PersonIcon />
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link href="/profile">
                    Profile
                  </MDBDropdownItem>
                  <MDBDropdownItem link href="/" onClick={handleLogout}>
                    Logout
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          ) : (
            <MDBNavbarItem>
              <MDBBtn href="/login" color="info">
                Login
              </MDBBtn>
            </MDBNavbarItem>
          )}
        </MDBNavbarNav>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default NavBar;
