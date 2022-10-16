import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import OAuthHandler from "./OauthHandler";
export default function LoginRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Signup />} />
      <Route path="oauth2/*" element={<OAuthHandler />}></Route>
    </Routes>
  );
}
