import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";

export default function HomepageRoutes() {
    return (
        <Routes>
            <Route path='/homepage' element={<HomePage />} />
        </Routes>
    );
}
