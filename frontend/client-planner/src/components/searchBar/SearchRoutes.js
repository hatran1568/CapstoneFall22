import React from "react";
import { Routes, Route } from "react-router-dom";
import  POIAndDestinationSearchBar from "./POIAndDestinationSearchBar"

export default function SearchRoutes() {
  return (
    <Routes>
      <Route path="/search" element={<POIAndDestinationSearchBar />}>
      
      </Route>
    </Routes>
  );
}
