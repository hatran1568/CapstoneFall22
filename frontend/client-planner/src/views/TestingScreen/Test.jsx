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
import CustomMarker from "./CustomMarker";
function storeCoordinate(xVal, yVal, array) {
  array.push({ x: xVal, y: yVal });
}

function getMarker(text) {
  return L.divIcon({
    className: "custom-div-icon",
    html:
      "<div style='background-color:#4838cc;' class='marker-pin'></div><span>" +
      text +
      "</span>",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });
}
function Test() {
  var coords = [];
  storeCoordinate(21.0285649, 105.8492929, coords);
  storeCoordinate(21.028345, 105.8502766, coords);
  storeCoordinate(21.0285649, 105.8492929, coords);

  return (
    <>
      {/* <Map
        markers={coords}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBs8QZJkjG-dZVHH8qkVpwavBfc-RKDjy8&callback=initMap`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={
          <div
            style={{
              height: `90vh`,
              margin: `auto`,
              border: "2px solid black",
              width: "90vw",
            }}
          />
        }
        mapElement={<div style={{ height: `100%` }} />}
      /> */}
      <div>
        <MapContainer
          center={[21.0285649, 105.8492929]}
          zoom={15}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {coords.map((mark, index) => (
            <Marker
              position={[mark.x, mark.y]}
              icon={getMarker(index)}
            ></Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}
export default Test;
