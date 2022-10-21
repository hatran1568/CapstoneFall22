import { Outlet, Route, Routes } from "react-router-dom";
import NavBar from "./NavBar";

const LayoutsWithNavbar = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default LayoutsWithNavbar;
