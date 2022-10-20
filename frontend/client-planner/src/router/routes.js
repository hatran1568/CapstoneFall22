import React from "react";
import { BrowserRouter } from "react-router-dom";
import LoginRoutes from "../views/Login/LoginRoutes";
import ProfileRoute from "../views/UserProfile/ProfileRoute";
import SearchRoutes from "../components/searchBar/SearchRoutes"
import SearchResultsRoutes from "../views/SearchResults/SearchResultsRoutes";
export default function RootRoutes() {
  return (
    <BrowserRouter>
      <LoginRoutes />
      <ProfileRoute />
      <SearchRoutes/>
      <SearchResultsRoutes/>
    </BrowserRouter>
  );
}
