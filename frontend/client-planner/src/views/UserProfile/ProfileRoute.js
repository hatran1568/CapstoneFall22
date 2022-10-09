import React from "react";
import { Routes, Route } from "react-router-dom";
import Profile from "./Profile";
import RequireAuth from "../../components/RequireAuth";

export default function ProfileRoute() {
  return (
    <Routes>
      <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
        <Route exact path="/profile" element={<Profile />}></Route>
      </Route>
    </Routes>
  );
}
