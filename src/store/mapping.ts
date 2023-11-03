import { defineStore } from 'pinia';
import MapView from '@arcgis/core/views/MapView';
import { initialize } from "@/data/map";
import Fuse from "fuse.js"; // Import the specific function from ArcGIS API
import { keys } from "@/data/keys";

let view: MapView;
export const useMappingStore = defineStore('mapping_store', {
  state: () => ({
    featureAttributes: [] as any[],
    fields: [] as any[]
  }),
  getters: {
    getFeatures(state) {
      return state.featureAttributes, state.fields
    }
  },
  actions: {
    async createMap(mapContainer: HTMLDivElement) {
      if (mapContainer) {
        view = await initialize(mapContainer);
      }
    },

    async addLayerToMap(layer: any) {
      if (view && layer) {
        view.map.add(layer);
      }
      this.queryLayerView(layer);
    },

    async queryLayerView(layer: any) {
      const querySurveys = layer.createQuery();
      querySurveys.geometry = layer.geometry;
      querySurveys.where = "1=1";
      querySurveys.outFields = ["*"];
      querySurveys.returnQueryGeometry = true;
      querySurveys.outSpatialReference = view.map.basemap.baseLayers.items[0].spatialReference;
      return layer.queryFeatures(querySurveys).then((fset: any) => {
        this.displayResults(fset);
      });
    },

    async displayResults(fset: any) {
      fset.features.forEach(feature => {
        // console.log(feature.attributes)
        this.featureAttributes.push(feature.attributes);
      });

      // Create a Fuse instance with your data and search options
      const fuse = new Fuse(this.featureAttributes, {
        keys: keys, // Fields to search in
        includeMatches: true, // Include match information
        threshold: 0.0, // Adjust the threshold as needed
      });

      // Perform the search using Fuse.js
      const query: any = '4666'; // Search query
      const searchResults = fuse.search(query);

      // The searchResults variable now contains the matched items, including the matching fields and values
      console.log(searchResults);
    },
  }
})
