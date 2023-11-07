import { defineStore } from 'pinia';
import { initialize } from "@/data/map";
import MapView from '@arcgis/core/views/MapView';
import Fuse, {FuseResultMatch} from "fuse.js";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import Graphic from "@arcgis/core/Graphic";
import { keys } from "@/data/keys";
import { surveyLayer, graphicsLayer, simpleFillSymbol, surveyTemplate } from "@/data/layers";

let view: MapView;
let featureSetData: FeatureSet
type StringOrArray = string | string[];


export const useMappingStore = defineStore('mapping_store', {
  state: () => ({
    featureAttributes: [] as any[],
    filteredData: [] as any[],
    searchCount: 0 as number,
    form: false as boolean,
    loading: false as boolean,
    searchedValue: '' as string,
    whereClause: '' as StringOrArray,
    surveyLayerCheckbox: true,
    searchedLayerCheckbox: false,
    fuse_key: '' as string,
    fuse_value: '' as string | number,
    dataLoaded: false as boolean
  }),
  getters: {
    getFeatures(state) {
      return state.featureAttributes,
             state.filteredData,
             state.searchCount,
             state.form,
             state.loading,
             state.searchedValue,
             state.whereClause,
             state.surveyLayerCheckbox,
             state.searchedLayerCheckbox,
             state.fuse_key,
             state.fuse_value,
             state.dataLoaded
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
      this.whereClause = "1=1"
      this.queryLayer(layer);
    },

    async queryLayer(layer: any) {
      const querySurveys = layer.createQuery();
      querySurveys.geometry = layer.geometry;
      querySurveys.where = this.whereClause;
      querySurveys.outFields = ["cs","image","rec_y","prepared_for","trsqq","prepared_by","subdivision","type","identification","pp"];
      querySurveys.returnQueryGeometry = true;
     // querySurveys.outSpatialReference = view.map.basemap.baseLayers.items[0].spatialReference;

      try {
        if (this.whereClause === "1=1") {
          featureSetData = await layer.queryFeatures(querySurveys);
        }
        else {
          surveyLayer.visible = false
          this.surveyLayerCheckbox = false
          return layer.queryFeatures(querySurveys).then((fset: any) => {
            this.createGraphicLayer(fset);
          });
        }
      } catch (error) {
        console.error("Error querying features:", error);
      }
    },

    async displayResults() {
      featureSetData.features.forEach(feature => {
        this.featureAttributes.push(feature.attributes);
      });

      this.dataLoaded = false
      this.whereClause = '';
      this.searchCount = 0;
      const uniqueClauses = new Set(); // Use a Set to store unique clauses

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
      searchResults.forEach((result) => {
        this.searchCount += 1;
        const matches: FuseResultMatch[] | any = result.matches; // Array of matches

        matches.forEach((match: any) => {
          this.fuse_key = match.key; // Key that matched the search query
          this.fuse_value = match.value; // Value that matched the search query
          // You can use key and value as needed in your code
          const clause = `${this.fuse_key} LIKE '%${this.searchedValue}%'`;
          // Add the clause to the uniqueClauses set
          uniqueClauses.add(clause);
        });
      });
      // Convert the uniqueClauses set to an array and join them with "OR"
      this.whereClause = Array.from(uniqueClauses).join(' OR ');
      if (this.searchCount > 0) {
        this.searchedLayerCheckbox = true;
        this.dataLoaded = true
      }
      // Log the generated WHERE clause for debugging
      console.log('Generated WHERE clause:', this.whereClause);
    },

    async createGraphicLayer(fset: any) {
      if (fset && fset.features) {
        const promises = fset.features.map(async (survey: any) => {
          const graphic = new Graphic({
            geometry: survey.geometry,
            attributes: survey.attributes,
            symbol: simpleFillSymbol,
            popupTemplate: surveyTemplate
          });

          graphicsLayer.graphics.push(graphic);
          view.map.add(graphicsLayer);

          return survey.attributes;
        });
        // Use Promise.all to wait for all promises to resolve
        const surveyAttributesArray = await Promise.all(promises);
        // Add the survey attributes to the filteredData array
        this.filteredData.push(...surveyAttributesArray);
        // Calculate the extent of all graphics
        const graphicsExtent = fset.features.reduce((extent: any, survey: any) => {
          extent.union(survey.geometry.extent);
          return extent;
        }, fset.features[0].geometry.extent);

        view.goTo(graphicsExtent).then(() => {
          console.log("view.GoTo Searched Surveys");
        });
      } else {
        console.warn('No features found in the query result.');
      }
    },

    async onSubmit() {
      this.filteredData = []
      graphicsLayer.graphics.removeAll()
      view.graphics.removeAll()
      this.displayResults()
      if (this.whereClause.length > 0) {
        this.queryLayer(surveyLayer);
      }
    },

    async surveyLayerCheck(e: any){
      this.surveyLayerCheckbox = e.target.checked;
      surveyLayer.visible = this.surveyLayerCheckbox;
    },

    async searchedLayerCheck(e: any) {
      this.searchedLayerCheckbox = e.target.checked;
      graphicsLayer.visible = this.searchedLayerCheckbox;
    }
  }
});
