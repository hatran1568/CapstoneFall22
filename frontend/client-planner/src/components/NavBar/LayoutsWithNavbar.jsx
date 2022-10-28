import { Outlet, Route, Routes } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";

const LayoutsWithNavbar = () => {
  return (
    <>
      <NavBar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          justifyContent: "space-between",
        }}
      >
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default LayoutsWithNavbar;
