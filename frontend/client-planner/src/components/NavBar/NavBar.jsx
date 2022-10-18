import React from "react";
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
import RequireAuth from "../../components/RequireAuth";
import style from "./NavBar.module.css";

const NavBar = () => {
    const pathname = window.location.pathname;
    const isLoggedIn = localStorage.getItem("token");

    return (
        <MDBNavbar expand='lg' light>
            <MDBContainer fluid>
                <MDBNavbarBrand className='fs-2' href='/homepage'>
                    TPS
                </MDBNavbarBrand>
                <MDBNavbarBrand className='fs-6 text-muted'>Plan things right</MDBNavbarBrand>

                <MDBNavbarNav>
                    <MDBNavbarItem>
                        <MDBNavbarLink className={pathname === "/homepage" ? "active" : ""} href='/homepage'>
                            Home
                        </MDBNavbarLink>
                    </MDBNavbarItem>

                    {/*<MDBNavbarItem>
                        <MDBNavbarLink className={pathname === "/login" ? "active" : ""} href='/login'>
                            Login
                        </MDBNavbarLink>
                    </MDBNavbarItem>*/}
                </MDBNavbarNav>

                <MDBNavbarNav>
                    <MDBNavbarItem>
                        <SearchBar />
                    </MDBNavbarItem>
                </MDBNavbarNav>

                <MDBNavbarNav right fullWidth={false}>
                    {isLoggedIn ? (
                        <MDBNavbarItem>
                            <MDBDropdown>
                                <MDBDropdownToggle tag='a' className='nav-link link-dark'>
                                    <PersonIcon />
                                </MDBDropdownToggle>
                                <MDBDropdownMenu>
                                    <MDBDropdownItem link href='/profile'>
                                        Profile
                                    </MDBDropdownItem>
                                    <MDBDropdownItem link href='#'>
                                        Another action
                                    </MDBDropdownItem>
                                    <MDBDropdownItem link href='/logout'>
                                        Logout
                                    </MDBDropdownItem>
                                </MDBDropdownMenu>
                            </MDBDropdown>
                        </MDBNavbarItem>
                    ) : (
                        <MDBNavbarItem>
                            <MDBBtn href='/login' color='info'>
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
