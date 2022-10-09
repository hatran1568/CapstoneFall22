import React from "react";
import { BrowserRouter } from "react-router-dom";
import LoginRoutes from "../views/Login/LoginRoutes";
import HomePageRoute from "../views/Home/HomePageRoute";
import ProfileRoute from "../views/UserProfile/ProfileRoute";
export default function RootRoutes() {
    return (
        <BrowserRouter>
            <LoginRoutes />
            <HomePageRoute />
            <ProfileRoute />
        </BrowserRouter>
    );
}
