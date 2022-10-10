import React from "react";
import { BrowserRouter } from "react-router-dom";
import LoginRoutes from "../views/Login/LoginRoutes";
import ProfileRoute from "../views/UserProfile/ProfileRoute";
import DestinationRoutes from "../views/DestinationDetails/DestinationRoutes";
import PlanningRoutes from "../views/CreateEmptyPlan/PlanningRoutes"
export default function RootRoutes() {
  return (
    <BrowserRouter>
      <LoginRoutes />
      <ProfileRoute />
      <DestinationRoutes />
      <PlanningRoutes />
    </BrowserRouter>
  );
}
