import React from "react";
import style from "./TripGeneralInfo.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapPin,
  faCalendar,
  faMapLocationDot,
  faCheck,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { Route, Link, Routes, useLocation, useParams } from "react-router-dom";
import { getPath } from "@mui/system";
export default function Tabs() {
  const location = useLocation();
  var path = location.pathname.slice(0, location.pathname.lastIndexOf("/"));
  var params = useParams();
  return (
    <div className={style.stickyNavFirst}>
      <ul className={`nav nav-tabs justify-content-center ${style.navTabs} `}>
        <li className={`nav-item`}>
          <a
            className={
              path.toLowerCase() == "/trip"
                ? `nav-link active ${style.navItem} ${style.navItemActive}`
                : `nav-link ${style.navItem}`
            }
            aria-current="page"
            href={"../trip/" + params.id}
          >
            General
          </a>
        </li>
        <li className={`nav-item ${style.dropDown}`}>
          <a
            className={
              path.toLowerCase() == "/timeline" ||
              path.toLowerCase() == "/timetable" ||
              path.toLowerCase() == "/map"
                ? `nav-link active ${style.navItem} ${style.navItemActive}`
                : `nav-link ${style.navItem}`
            }
          >
            Day by day{" "}
            <FontAwesomeIcon
              icon={faCaretDown}
              className={style.dropDownIcon}
              size="lg"
            />
          </a>
          <div className={style.dropdownContent}>
            <a
              href={"../timeline/" + params.id}
              className={path == "/timeline" ? style.active : ""}
            >
              <FontAwesomeIcon icon={faMapPin} className={style.icons} />
              Timeline{" "}
              {path.toLowerCase() == "/timeline" && (
                <FontAwesomeIcon icon={faCheck} className={style.checkIcons} />
              )}
            </a>
            <a
              href={"../timetable/" + params.id}
              className={path == "/timetable" ? style.active : ""}
            >
              <FontAwesomeIcon icon={faCalendar} className={style.icons} />
              Calendar
              {path.toLowerCase() == "/timetable" && (
                <FontAwesomeIcon icon={faCheck} className={style.checkIcons} />
              )}
            </a>
            <a
              href={"../map/" + params.id}
              className={path == "/map" ? style.active : ""}
            >
              <FontAwesomeIcon
                icon={faMapLocationDot}
                className={style.icons}
              />
              Map
              {path.toLowerCase() == "/map" && (
                <FontAwesomeIcon icon={faCheck} className={style.checkIcons} />
              )}
            </a>
          </div>
        </li>
        <li className="nav-item">
          <a
            className={
              path == "/checklist"
                ? `nav-link active ${style.navItem} ${style.navItemActive}`
                : `nav-link ${style.navItem}`
            }
            href={"../checklist/" + params.id}
          >
            Checklist
          </a>
        </li>
        <li className="nav-item">
          <a
            className={
              path == "/budget"
                ? `nav-link active ${style.navItem} ${style.navItemActive}`
                : `nav-link ${style.navItem}`
            }
            href={"../budget/" + params.id}
          >
            Budget
          </a>
        </li>
      </ul>
    </div>
  );
}
