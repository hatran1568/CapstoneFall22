import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateEmptyPlan from "./CreateEmptyPlan";

export default function PlanningRoutes() {
  return (
    <Routes>
      <Route exact path="/EmptyPlan" element={<CreateEmptyPlan />} />
    </Routes>
  );
}