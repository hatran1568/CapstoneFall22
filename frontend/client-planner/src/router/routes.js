import React from "react";
import { BrowserRouter } from "react-router-dom";
import LoginRoutes from "../views/Login/LoginRoutes";
import TimelineRoute from "../views/Timeline/timelineRoute";
export default function Routes() {
  return (
    <BrowserRouter>
      <LoginRoutes />
      <TimelineRoute/>
    </BrowserRouter>
  );
}
