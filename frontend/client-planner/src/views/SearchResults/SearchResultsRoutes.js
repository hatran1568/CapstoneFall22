import SearchResults from "./SearchResults";
import React from "react";
import { Routes, Route } from "react-router-dom";
import CardItem from "./CardItem";

export default function SearchRoutes() {
  return (
    <Routes>
      <Route path="/searchResults" element={<SearchResults />}></Route>
      <Route path="/card" element={<CardItem/>}></Route>
    
    </Routes>
  );
}