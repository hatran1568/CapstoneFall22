import React from "react";
import { Routes, Route } from "react-router-dom";
import POIAndDestinationSearchBar from "./POIAndDestinationSearchBar";
import POISearchBar from "../POISearchBar/POISearchBar";

export default function SearchRoutes() {
  return (
    <Routes>
      <Route
        path="/search"
        element={
          <div>
            <POIAndDestinationSearchBar />
            <POISearchBar />
          </div>
        }
      ></Route>
    </Routes>
  );
}
