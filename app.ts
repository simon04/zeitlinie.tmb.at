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
L.control
  .attribution({
    prefix: `
      <a href="https://github.com/simon04/zeitlinie.tmb.at/">@simon04/zeitlinie.tmb.at</a>
      (<a href="https://github.com/simon04/zeitlinie.tmb.at/blob/master/LICENSE">GPL v3</a>)`,
  })
  .addTo(map);
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

// interpret end date as exclusive:
// replace lookup `time <= featureTime` with `time < featureTime`
const lookup = timeline.ranges.lookup;
timeline.ranges.lookup = (time) =>
  lookup.call(timeline.ranges, time).filter((feature: GeoJSON.Feature) => {
    const featureTime = timeline._getInterval(feature);
    return featureTime && time < featureTime.end;
  });

L.timelineSliderControl({
  enableKeyboardControls: true,
  formatOutput(time) {
    const date = new Date(time);
    return date.toLocaleDateString("de", {
      year: "numeric",
      month: date.getDate() > 1 || date.getMonth() > 1 ? "long" : undefined,
      day: date.getDate() > 1 ? "numeric" : undefined,
    });
  },
  waitToUpdateMap: true,
})
  .addTo(map)
  .addTimelines(timeline);
