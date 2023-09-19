import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import BlogAddUpdate from "../../views/Admin/BlogAddUpdate";
import { ProSidebarProvider } from "react-pro-sidebar";
import axios from "../../api/axios";
import { useState } from "react";
import { useEffect } from "react";
import {
  faBars,
  faLocationDot,
  faPlaceOfWorship,
  faBook,
  faPenToSquare,
  faUsers,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import {
  MDBRow,
  MDBCol,
  MDBNavbarBrand,
  MDBDropdownItem,
  MDBNavbarItem,
  MDBBtn,
  MDBNavbarNav,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBNavbar,
  MDBContainer,
} from "mdb-react-ui-kit";
import PersonIcon from "@mui/icons-material/Person";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./SideBar.module.css";
function AdminSidebar({ props }) {
  const { collapseSidebar } = useProSidebar();
  const pathname = window.location.pathname;
  const isLogged = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    window.location.href = "/";
  };
  const [user, setUser] = useState({});
  useEffect(() => {
    try {
      const listResp = async () => {
        await axios
          .get(
            "http://localhost:8080/user/api/user/findById/" +
              localStorage.getItem("id"),
          )
          .then((response) => setUser(response.data));
      };
      listResp();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar
        id="sidebar"
        width="270px"
        collapsedWidth="0px"
        className={style.sidebar}
      >
        <Menu width="270px" collapsedWidth="0px" className={style.sidebarMenu}>
          <MDBNavbarBrand href="/" className="me-0">
            <p className="mb-0 d-flex align-items-center">
              <span className="fs-3 me-2">TPS</span>
              <span className="fs-5 text-muted">Itinerary planner</span>
            </p>
          </MDBNavbarBrand>
          <MenuItem>
            <a href="/admin/dashboard" className={style.sidebarItem}>
              <MDBRow>
                <MDBCol md={2} className={style.sidebarIcon}>
                  <FontAwesomeIcon icon={faChartLine} />
                </MDBCol>
                <MDBCol md={2} className={style.sidebarText}>
                  Bảng điều khiển
                </MDBCol>
              </MDBRow>
            </a>
          </MenuItem>
          <MenuItem>
            <a href="/poi/adminlist" className={style.sidebarItem}>
              <MDBRow>
                <MDBCol md={2} className={style.sidebarIcon}>
                  <FontAwesomeIcon icon={faPlaceOfWorship} />
                </MDBCol>
                <MDBCol md={2} className={style.sidebarText}>
                  Địa điểm
                </MDBCol>
              </MDBRow>
            </a>
          </MenuItem>
          <MenuItem>
            <a href="/destination/adminlist" className={style.sidebarItem}>
              <MDBRow>
                <MDBCol md={2} className={style.sidebarIcon}>
                  <FontAwesomeIcon icon={faLocationDot} />
                </MDBCol>
                <MDBCol md={2} className={style.sidebarText}>
                  Điểm đến
                </MDBCol>
              </MDBRow>
            </a>
          </MenuItem>
          <MenuItem>
            <a href="/blog/list" className={style.sidebarItem}>
              <MDBRow>
                <MDBCol md={2} className={style.sidebarIcon}>
                  <FontAwesomeIcon icon={faBook} />
                </MDBCol>
                <MDBCol md={2} className={style.sidebarText}>
                  Blogs
                </MDBCol>
              </MDBRow>
            </a>
          </MenuItem>
          <MenuItem>
            <a href="/request/list" className={style.sidebarItem}>
              <MDBRow>
                <MDBCol md={2} className={style.sidebarIcon}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </MDBCol>
                <MDBCol md={2} className={style.sidebarText}>
                  Yêu cầu chỉnh sửa
                </MDBCol>
              </MDBRow>
            </a>
          </MenuItem>
          <MenuItem>
            <a href="/user/list" className={style.sidebarItem}>
              <MDBRow>
                <MDBCol md={2} className={style.sidebarIcon}>
                  <FontAwesomeIcon icon={faUsers} />
                </MDBCol>
                <MDBCol md={2} className={style.sidebarText}>
                  Tài khoản người dùng
                </MDBCol>
              </MDBRow>
            </a>
          </MenuItem>

          {isLogged ? (
            <span className={style.profileIcon}>
              <MDBDropdown>
                <MDBDropdownToggle tag="a" className="nav-link link-dark">
                  <img src={user.avatar} className={style.userAvatar} />
                  <span className={style.username}>{user.name}</span>
                </MDBDropdownToggle>
                <MDBDropdownMenu>
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
            </span>
          ) : (
            <span className={style.profileIcon}>
              <MDBBtn href="/login" color="info">
                Đăng nhập
              </MDBBtn>
            </span>
          )}
        </Menu>
      </Sidebar>
      <a className={style.expandBtn} onClick={() => collapseSidebar()}>
        <main>
          <FontAwesomeIcon icon={faBars} />
        </main>
      </a>
      {props}
    </div>
  );
}
export default AdminSidebar;
