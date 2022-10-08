import React from "react";
import { Routes, Route } from "react-router-dom";
import Timeline from "./timeline";

export default function TimelineRoute() {
  return (
    <Routes>
      <Route exact path="/timeline" element={<Timeline />} />
    </Routes>
  );
}
