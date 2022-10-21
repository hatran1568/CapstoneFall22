import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../views/Login/Login";
import Signup from "../views/Login/Signup";
import OAuthHandler from "../views/Login/OauthHandler";
import ProfilePage from "../views/UserProfile/ProfilePage";
import RequireAuth from "../components/RequireAuth";
import Timeline from "../views/Timeline/timeline";
import DestinationDetails from "../views/DestinationDetails/DestinationDetails";
import POIsDestination from "../views/POIsDestination/POIsDestination";
import CreateEmptyPlan from "../views/CreateEmptyPlan/CreateEmptyPlan";
import POIAndDestinationSearchBar from "../components/searchBar/POIAndDestinationSearchBar"
export default function RootRoutes() {
  return (
    <Router>
      <Routes>
        <Route exact path="login" element={<Login />} />
        <Route path="register" element={<Signup />} />
        <Route path="oauth2/*" element={<OAuthHandler />}/>
        <Route element={<RequireAuth allowedRoles={["User", "Admin"]} />}>
          <Route path="/profile" element={<ProfilePage />}></Route>
        </Route>
        <Route path="/timeline/:id" element={<Timeline />} />
        <Route path="/search" element={<POIAndDestinationSearchBar />}></Route>
        <Route exact path="/Destination" element={<DestinationDetails />} />
      <Route exact path="/Destination/POIs" element={<POIsDestination />} />
      <Route exact path="/EmptyPlan" element={<CreateEmptyPlan />} />
      </Routes>
    </Router>
  );
}
