import React from "react";
import { Routes, Route } from "react-router-dom";
import DestinationDetails from "./DestinationDetails";
import POIsDestination from "../POIsDestination/POIsDestination";

export default function DestinationRoutes() {
  return (
    <Routes>
      <Route exact path="/Destination" element={<DestinationDetails />} />
      <Route exact path="/Destination/POIs" element={<POIsDestination />} />
    </Routes>
  );
}