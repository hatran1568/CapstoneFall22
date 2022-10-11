import React from "react";
import { BrowserRouter } from "react-router-dom";
import LoginRoutes from "../views/Login/LoginRoutes";
import ProfileRoute from "../views/UserProfile/ProfileRoute";
export default function Routes() {
  return (
    <BrowserRouter>
      <LoginRoutes />
      <ProfileRoute />
    </BrowserRouter>
  );
}
