import { defineStore } from 'pinia';
import MapView from '@arcgis/core/views/MapView';
import { initialize} from "@/data/map";


let view: MapView;
export const useMappingStore = defineStore('mapping_store', {
  state: () => ({

  }),
  getters: {

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
    },
  },
});
