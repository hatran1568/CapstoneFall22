import React from "react";
import { BrowserRouter } from "react-router-dom";
import LoginRoutes from "../views/Login/LoginRoutes";
import HomePageRoutes from "../views/Homepage/HomePageRoutes";
export default function Routes() {
    return (
        <BrowserRouter>
            <LoginRoutes />
            <HomePageRoutes />
        </BrowserRouter>
    );
}
