import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";

export default function LoginRoutes() {
  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/register" element={<Signup />} />
    </Routes>
  );
}