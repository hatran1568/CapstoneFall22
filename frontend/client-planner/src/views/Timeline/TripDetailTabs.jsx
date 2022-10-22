import React from "react";
import style from "./timeline.module.css";
import { Route, Link, Routes, useLocation, useParams } from "react-router-dom";
export default function Tabs() {
  // 👇️ with React router
  // const location = useLocation();
  // console.log("hash", location.hash);
  // console.log("pathname", location.pathname);
  // console.log(useParams());
  return (
    <div className={style.stickyNavFirst}>
      <ul className='nav nav-tabs justify-content-center'>
        <li className='nav-item'>
          <a className='nav-link active' aria-current='page' href='#'>
            Active
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link' href='#'>
            Link
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link' href='#'>
            Link
          </a>
        </li>
        <li className='nav-item'>
          <a className='nav-link disabled' href='#' tabIndex='-1' aria-disabled='true'>
            Disabled
          </a>
        </li>
      </ul>
    </div>
  );
}
