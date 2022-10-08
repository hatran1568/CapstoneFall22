import React from "react";
import { BrowserRouter } from "react-router-dom";
//import LoginRoutes from "../views/Login/LoginRoutes";
import DestinationRoutes from "../views/DestinationDetails/DestinationRoutes";
export default function Routes() {
  return (
    <BrowserRouter>
      {/* <LoginRoutes /> */}
      <DestinationRoutes/>
    </BrowserRouter>
  );
}
