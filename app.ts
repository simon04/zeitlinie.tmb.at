import "./app.css";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-providers";

const map = L.map(document.getElementById("map"), {
  center: [47.265, 11.39],
  zoom: 15,
});
L.tileLayer.provider("BasemapAT.grau").addTo(map);
