import "./app.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-providers";
import "leaflet.timeline/dist/Timeline";
import "leaflet.timeline/dist/TimelineSliderControl";
import Innsbruck from "./innsbruck.geojson";

const map = L.map(document.getElementById("map"), {
  center: [47.265, 11.39],
  zoom: 15,
  attributionControl: false,
});
L.control.attribution({ prefix: false }).addTo(map);
L.tileLayer.provider("BasemapAT.grau").addTo(map);

const timeline = L.timeline(Innsbruck, {
  onEachFeature(feature, layer) {
    // layer.bindTooltip(feature.properties.name);
  },
  style(feature) {
    return {
      fill: false,
      stroke: true,
      weight: 4,
      color: feature?.properties?.colour ?? "red",
    };
  },
}).addTo(map);

L.timelineSliderControl({
  enableKeyboardControls: true,
  formatOutput(date) {
    return new Date(date).toLocaleDateString("de", { year: "numeric" });
  },
  waitToUpdateMap: true,
})
  .addTo(map)
  .addTimelines(timeline);
