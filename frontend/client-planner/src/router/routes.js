import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../views/Login/Login";
import Signup from "../views/Login/Signup";
import OAuthHandler from "../views/Login/OauthHandler";
import ProfilePage from "../views/UserProfile/ProfilePage";
import RequireAuth from "../components/RequireAuth";
import Timeline from "../views/Timeline/timeline";
import POIAndDestinationSearchBar from "../components/searchBar/POIAndDestinationSearchBar";
import HomePage from "../views/HomePage/HomePage";
import LayoutsWithNavbar from "../components/NavBar/LayoutsWithNavbar";
import SearchResults from "../views/SearchResults/SearchResults";
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
                    <Route path='/timeline/:id' element={<Timeline />} />
                    <Route path='/search' element={<POIAndDestinationSearchBar />} />
                    <Route path='/' element={<HomePage />} />
                    <Route path='/SearchResults' element={<SearchResults />} />
                </Route>

                {/*Routes that don't need a nav bar go out here.*/}
            </Routes>
        </Router>
    );
}
