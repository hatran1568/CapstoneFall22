import React from "react";
import style from "./HomePage.module.css";
import POISearchBar from "../../components/POISearchBar/POISearchBar";

function HomePage() {
    return (
        <div className='homepage'>
            <POISearchBar />
        </div>
    );
}

export default HomePage;
