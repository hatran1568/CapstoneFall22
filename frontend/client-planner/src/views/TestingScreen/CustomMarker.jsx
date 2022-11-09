import { positions } from "@mui/system";
import React from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";

import LeafLetMap from "./LeafLetMap";
function CustomMarker(props) {
  return L.divIcon({
    className: "custom-div-icon",
    html:
      "<div style='background-color:#4838cc;' class='marker-pin'></div><span>" +
      props.text +
      "</span>",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
}
export default CustomMarker;
