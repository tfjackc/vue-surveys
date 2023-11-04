import { defineStore } from 'pinia';
import MapView from '@arcgis/core/views/MapView';
import { initialize } from "@/data/map";
import Fuse from "fuse.js"; // Import the specific function from ArcGIS API
import { keys } from "@/data/keys";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Layer from "@arcgis/core/layers/Layer";
import {bufferGraphic, surveyLayer, fillSymbol} from "@/data/layers";

let view: MapView;
let featureSetData: FeatureSet
type StringOrArray = string | string[];

export const useMappingStore = defineStore('mapping_store', {
  state: () => ({
    featureAttributes: [] as any[],
    //featureSetData: [] as any[],
    fields: [] as any[],
    form: false as boolean,
    loading: false as boolean,
    searchedValue: '' as string,
    filteredData: [] as any[],
    whereClause: '' as StringOrArray,
  }),
  getters: {
    getFeatures(state) {
      return state.featureAttributes, state.fields, state.form, state.loading, state.searchedValue, state.filteredData, state.whereClause
    }
  },
  actions: {
    // async onSubmit ()  {
    //   console.log("on submit ran")
    //   console.log(this.searchedValue)
    // },

    async createMap(mapContainer: HTMLDivElement) {
      if (mapContainer) {
        view = await initialize(mapContainer);
      }
    },

    async addLayerToMap(layer: any) {
      if (view && layer) {
        view.map.add(layer);
      }
      this.whereClause = "1=1"
      this.queryLayer(layer);
    },

    async queryLayer(layer: any) {
      const querySurveys = layer.createQuery();
      querySurveys.geometry = layer.geometry;
      querySurveys.where = this.whereClause;
      querySurveys.outFields = ["*"];
      querySurveys.returnQueryGeometry = true;
      querySurveys.outSpatialReference = view.map.basemap.baseLayers.items[0].spatialReference;

      try {
        if (this.whereClause === "1=1") {
          featureSetData = await layer.queryFeatures(querySurveys);
        }
        else {
          view.map.remove(layer)
          return layer.queryFeatures(querySurveys).then((fset: any) => {
            this.createGraphicLayer(fset);
          });
        }
      } catch (error) {
        console.error("Error querying features:", error);
      }
    },

    async displayResults() {
      // const fset = await this.featureSetData

      featureSetData.features.forEach(feature => {
        this.featureAttributes.push(feature.attributes);
      });

      this.whereClause = '';

      // Create a Fuse instance with your data and search options
      const fuse = new Fuse(this.featureAttributes, {
        keys: keys, // Fields to search in
        includeMatches: true, // Include match information
        threshold: 0.0, // Adjust the threshold as needed
      });

      // Perform the search using Fuse.js
      const query = this.searchedValue; // Search query
      const searchResults = fuse.search(query);

      // Build the WHERE clause with OR conditions
      searchResults.forEach((result, index) => {
        const feature = result.item;
        if (index > 0) {
          this.whereClause += ' OR ';
        }
        this.whereClause += `OBJECTID = ${feature.OBJECTID}`;
      });

      // Log the generated WHERE clause for debugging
      console.log('Generated WHERE clause:', this.whereClause);
    },

    async createGraphicLayer(fset: any) {

      if (fset && fset.features) {

        console.log(fset.features)

        fset.features.forEach(function (survey: any) {
          const graphic = new Graphic({
            geometry: survey.geometry,
            attributes: survey.attributes,
            symbol: fillSymbol
          });

          view.graphics.add(graphic);
        });

        // Calculate the extent of all graphics
        const graphicsExtent = fset.features.reduce((extent: any, survey: any) => {
          extent.union(survey.geometry.extent);
          return extent;
        }, fset.features[0].geometry.extent);

        view.goTo(graphicsExtent).then(() => {
          console.log("going to searched surveys");
        });
      } else {
        console.warn('No features found in the query result.');
      }
    },

    async onSubmit() {
     // console.log(this.featureSetData)
      //console.log(this.searchedValue);
      view.graphics.removeAll()
      this.displayResults()
      this.queryLayer(surveyLayer);
      // You can now use searchResults for further processing, like adding features to the map or updating the UI.
    },
  }
});
