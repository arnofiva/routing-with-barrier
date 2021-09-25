import "./style.scss";

import Map = require("esri/Map");
import SceneView = require("esri/views/SceneView");
import Directions = require("esri/widgets/Directions");
import MapView = require("esri/views/MapView");

import esriConfig = require("esri/config");
import Point = require("esri/geometry/Point");
import SpatialReference = require("esri/geometry/SpatialReference");
import FeatureLayer = require("esri/layers/FeatureLayer");

esriConfig.apiKey = "REPLACE_WITH_API_KEY";

const barrier = new FeatureLayer({
  url: "https://services8.arcgis.com/VAHmVwXyn8lMPYKG/arcgis/rest/services/flood/FeatureServer/0"
});

const map = new Map({
  basemap: "arcgis-topographic", // Basemap layer,
  layers: [barrier]
});

const view = new MapView({
  container: "viewDiv",
  map,
  center: new Point({
    x: 949847.7341356392,
    y: 6004943.688799374,
    spatialReference: SpatialReference.WebMercator
  }),
  zoom: 14
});

const directions = new Directions({
  view
});

const viewModel = directions.viewModel;

barrier.load().then(async () => {
  const query = barrier.createQuery();
  query.returnGeometry = true;
  const result = await barrier.queryFeatures(query);

  viewModel.routeParameters.polygonBarriers = result;

  console.log("Ready");
});

// viewModel.routeParameters.polygonBarriers = {
//   url: "https://services8.arcgis.com/VAHmVwXyn8lMPYKG/arcgis/rest/services/flood/FeatureServer/0"
// } as any;

view.ui.add(directions, "top-right");
window["view"] = view;

window["directions"] = directions.viewModel;