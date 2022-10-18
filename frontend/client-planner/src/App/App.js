import "./App.css";
import React from "react";
import Routes from "../router/routes";
import NavBar from "../components/NavBar/NavBar";

function App() {
    return (
        <div>
            <div>
                <NavBar />
            </div>
            <Routes></Routes>
        </div>
    );
}

export default App;
