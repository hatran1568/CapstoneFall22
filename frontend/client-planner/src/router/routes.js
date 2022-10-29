import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../views/Login/Login";
import Signup from "../views/Login/Signup";
import OAuthHandler from "../views/Login/OauthHandler";
import ProfilePage from "../views/UserProfile/ProfilePage";
import RequireAuth from "../components/RequireAuth";
import Timeline from "../views/Timeline/timeline";
import TripGeneralInfo from "../views/Timeline/TripGeneralInfo";
import DestinationDetails from "../views/DestinationDetails/DestinationDetails";
import POIsDestination from "../views/POIsDestination/POIsDestination";
import POIAndDestinationSearchBar from "../components/searchBar/POIAndDestinationSearchBar";
import HomePage from "../views/HomePage/HomePage";
import LayoutsWithNavbar from "../components/NavBar/LayoutsWithNavbar";
import SearchResults from "../views/SearchResults/SearchResults";
import POIDetails from "../views/POIDetails/POIDetails";
import Timetable from "../views/Timetable/Timetable";
import Test from "../views/TestingScreen/Test";
import ChangePassword from "../views/UserProfile/ChangePassword";
import RequestResetPassword from "../views/Login/RequestResetPassword";
import ResetPasswordConfirm from "../views/Login/ResetPasswordConfirm";
import CollectionDetail from "../views/CollectionDetail/CollectionDetail";

export default function RootRoutes() {
  return (
    <Router>
      <Routes>
        {/*Any route that needs a nav bar goes inside this one.*/}
        <Route path='/' element={<LayoutsWithNavbar />}>
          <Route path='/' element={<HomePage />} />
          <Route exact path='login' element={<Login />} />
          <Route path='register' element={<Signup />} />
          <Route path='oauth2/*' element={<OAuthHandler />} />
          <Route element={<RequireAuth allowedRoles={["User", "Admin"]} />}>
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/change-password' element={<ChangePassword />} />
            <Route path='/collection' element={<CollectionDetail />} />
          </Route>
          <Route path='/forgot-password' element={<RequestResetPassword />} />
          <Route path='/reset-password-confirm' element={<ResetPasswordConfirm />} />
          <Route exact path='/Destination' element={<DestinationDetails />} />
          <Route exact path='/Destination/POIs' element={<POIsDestination />} />
          <Route path='/timeline/:id' element={<Timeline />} />
          <Route path='/timetable/:id' element={<Timetable />} />
          <Route path='/trip/:id' element={<TripGeneralInfo />} />
          <Route path='/search' element={<POIAndDestinationSearchBar />} />
          <Route path='/SearchResults' element={<SearchResults />} />
          <Route path='/poi' element={<POIDetails />} />
        </Route>

        {/*Routes that don't need a nav bar go out here.*/}
      </Routes>
    </Router>
  );
}
