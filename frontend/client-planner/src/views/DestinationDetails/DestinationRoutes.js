import React from "react";
import { Routes, Route } from "react-router-dom";
import DestinationDetails from "./DestinationDetails";

export default function DestinationRoutes() {
  return (
    <Routes>
      <Route exact path="/Destination" element={<DestinationDetails />} />
    </Routes>
  );
}