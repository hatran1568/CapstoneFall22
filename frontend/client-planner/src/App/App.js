import "./App.css";
import React from "react";
import Routes from "../router/routes";
import NavBar from "../components/NavBar/NavBar";

function App() {
    return (
        <div>
            <NavBar />
            <Routes></Routes>
        </div>
    );
}

export default App;
