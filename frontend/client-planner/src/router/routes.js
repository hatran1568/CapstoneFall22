import React from "react";
import { BrowserRouter } from "react-router-dom";
import LoginRoutes from "../views/Login/LoginRoutes";
import ProfileRoute from "../views/UserProfile/ProfileRoute";
import TimelineRoute from "../views/Timeline/timelineRoute";
export default function RootRoutes() {
  return (
    <BrowserRouter>
      <LoginRoutes />
      <ProfileRoute />
      <TimelineRoute/>
    </BrowserRouter>
  );
}
