<template>
    <v-app id="inspire">
        <v-main class="bg-shades-dark-gray">
                <v-row>
                    <v-col cols="4">
                        <v-sheet rounded="lg">
                            <v-divider class="my-2"></v-divider>
                            <v-list rounded="lg">
                                  <Search />
                                <v-divider class="my-2"></v-divider>
                                  <LayerList />
                            </v-list>
                        </v-sheet>
                    </v-col>
                    <v-col>
                        <MapComponent />
                    </v-col>
                </v-row>
          <v-expansion-panels v-if="filteredData.length > 0" flat height="92">
            <v-expansion-panel title="Data Table">
              <v-expansion-panel-text>
                <TableComponent />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-main>
    </v-app>
</template>
<script lang="ts" setup>
import MapComponent from "@/components/MapComponent.vue";
import LayerList from "@/components/LayerList.vue";
import Search from "@/components/Search.vue";
import TableComponent from "@/components/TableComponent.vue";
import { useMappingStore } from "@/store/mapping";
import {storeToRefs} from "pinia";
const mapping_store = useMappingStore()
const { filteredData } = storeToRefs(mapping_store)
</script>

