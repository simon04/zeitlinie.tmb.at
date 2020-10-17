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
const layers = L.control.layers().addTo(map);
L.control
  .attribution({
    prefix: `
      <a href="https://github.com/simon04/zeitlinie.tmb.at/">@simon04/zeitlinie.tmb.at</a>
      (<a href="https://github.com/simon04/zeitlinie.tmb.at/blob/master/LICENSE">GPL v3</a>)`,
  })
  .addTo(map);
const basemap = L.tileLayer.provider("BasemapAT.grau").addTo(map);
layers.addBaseLayer(basemap, "basemap.at");
layers.addBaseLayer(L.tileLayer.provider("OpenStreetMap"), "OpenStreetMap");
[
  { id: "Image_1940", title: "Orthofoto Tirol: 1940" },
  { id: "Image_1970-1982", title: "Orthofoto Tirol: 1970–1982" },
  { id: "Image_1999-2004", title: "Orthofoto Tirol: 1999–2004" },
  { id: "Image_2004-2009", title: "Orthofoto Tirol: 2004–2009" },
  { id: "Image_2009-2012", title: "Orthofoto Tirol: 2009–2012" },
  { id: "Image_2013-2015", title: "Orthofoto Tirol: 2013–2015" },
  { id: "Image_2016", title: "Orthofoto Tirol: 2016" },
  { id: "Image_Aktuell_RGB", title: "Orthofoto Tirol: aktuell" },
].forEach(({ id, title }) =>
  layers.addBaseLayer(
    L.tileLayer.wms(
      "https://gis.tirol.gv.at/arcgis/services/Service_Public/orthofoto/MapServer/WMSServer",
      {
        layers: id,
        format: "image/jpeg",
        maxZoom: 20,
        attribution: `
          <a href="https://www.tirol.gv.at/data/">data.tirol.gv.at</a>'
          (<a href="https://www.tirol.gv.at/data/nutzungsbedingungen/">CC BY 3.0 AT</a>`,
      }
    ),
    title
  )
);

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
