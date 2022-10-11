import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import RequireAuth from "../../components/RequireAuth";

export default function ProfileRoute() {
  return (
    <Routes>
      <Route element={<RequireAuth allowedRoles={["User", "Admin"]} />}>
        <Route path="/profile" element={<ProfilePage />}></Route>
      </Route>
    </Routes>
  );
}
