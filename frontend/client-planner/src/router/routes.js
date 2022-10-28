import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../views/Login/Login";
import Signup from "../views/Login/Signup";
import OAuthHandler from "../views/Login/OauthHandler";
import ProfilePage from "../views/UserProfile/ProfilePage";
import RequireAuth from "../components/RequireAuth";
import Timeline from "../views/Timeline/timeline";
import TripBudget from "../views/Timeline/TripBudget";
import TripGeneralInfo from "../views/Timeline/TripGeneralInfo";
import DestinationDetails from "../views/DestinationDetails/DestinationDetails";
import POIsDestination from "../views/POIsDestination/POIsDestination";
import POIAndDestinationSearchBar from "../components/searchBar/POIAndDestinationSearchBar";
import HomePage from "../views/HomePage/HomePage";
import LayoutsWithNavbar from "../components/NavBar/LayoutsWithNavbar";
import SearchResults from "../views/SearchResults/SearchResults";
import POIDetails from "../views/POIDetails/POIDetails";
import BlogDetails from "../views/Blog/BlogDetails";
export default function RootRoutes() {
  return (
    <Router>
      <Routes>
        {/*Any route that needs a nav bar goes inside this one.*/}
        <Route path='/' element={<LayoutsWithNavbar />}>
          <Route exact path='login' element={<Login />} />
          <Route path='register' element={<Signup />} />
          <Route path='oauth2/*' element={<OAuthHandler />} />
          <Route element={<RequireAuth allowedRoles={["User", "Admin"]} />}>
            <Route path='/profile' element={<ProfilePage />} />
          </Route>
          <Route exact path='/Destination' element={<DestinationDetails />} />
          <Route exact path='/Destination/POIs' element={<POIsDestination />} />
          <Route path='/timeline/:id' element={<Timeline />} />
          <Route path='/budget/:id' element={<TripBudget />} />
          <Route path='/trip/:id' element={<TripGeneralInfo />} />
          <Route path='/search' element={<POIAndDestinationSearchBar />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/SearchResults' element={<SearchResults />} />
          <Route path='/poi' element={<POIDetails />} />
          <Route path='/blog' element={<BlogDetails />} />
        </Route>

        {/*Routes that don't need a nav bar go out here.*/}
      </Routes>
    </Router>
  );
}
