import React from "react";
import { BrowserRouter } from "react-router-dom";
import LoginRoutes from "../views/Login/LoginRoutes";
export default function Routes() {
  return (
    <BrowserRouter>
      <LoginRoutes />
    </BrowserRouter>
  );
}
