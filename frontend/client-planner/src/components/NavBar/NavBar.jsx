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
import style from "./NavBar.module.css";
import useAuth from "../../hooks/useAuth";

const NavBar = () => {
    const pathname = window.location.pathname;
    const [isLogged, setIslogged] = useState(localStorage.getItem("token") !== null);

    const handleLogout = () => {
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIslogged(false);
    };
    const auth = useAuth();
    useEffect(() => {}, [auth]);

    return (
        <MDBNavbar expand='lg' light className={style.navBar}>
            <MDBContainer fluid>
                <MDBNavbarBrand href='/homepage' className='me-0'>
                    <p className='mb-0 d-flex align-items-center'>
                        <span className='fs-3 me-2'>TPS</span>
                        <span className='fs-5 text-muted'>Itinerary planner</span>
                    </p>
                </MDBNavbarBrand>

                <MDBNavbarNav>
                    <MDBNavbarItem>
                        <MDBNavbarLink
                            className={pathname === "/homepage" ? "active" : ""}
                            href='/homepage'
                        ></MDBNavbarLink>
                    </MDBNavbarItem>

                    {/*<MDBNavbarItem>
                        <MDBNavbarLink className={pathname === "/login" ? "active" : ""} href='/login'>
                            Login
                        </MDBNavbarLink>
                    </MDBNavbarItem>*/}
                </MDBNavbarNav>

                <MDBNavbarNav center>
                    <MDBNavbarItem>
                        <SearchBar />
                    </MDBNavbarItem>
                </MDBNavbarNav>

                <MDBNavbarNav right fullWidth={false}>
                    {auth ? (
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
                                    <MDBDropdownItem link href="/homepage" onClick={handleLogout}>
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
