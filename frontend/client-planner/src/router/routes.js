import React from "react";
import { BrowserRouter } from "react-router-dom";
import LoginRoutes from "../views/Login/LoginRoutes";
import ProfileRoute from "../views/UserProfile/ProfileRoute";
<<<<<<< HEAD
import TimelineRoute from "../views/Timeline/timelineRoute";
=======
import SearchRoutes from "../components/searchBar/SearchRoutes"
>>>>>>> 26ae37fc82c011b6c10ec552d0f2a3e08641bb46
export default function RootRoutes() {
  return (
    <BrowserRouter>
      <LoginRoutes />
      <ProfileRoute />
<<<<<<< HEAD
      <TimelineRoute/>
=======
      <SearchRoutes/>
>>>>>>> 26ae37fc82c011b6c10ec552d0f2a3e08641bb46
    </BrowserRouter>
  );
}
