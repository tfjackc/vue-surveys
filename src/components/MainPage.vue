<template>
    <v-app id="inspire">
        <v-main class="bg-shades-dark-gray">
            <v-container>
                <v-row>
                    <v-col cols="4">
                        <v-sheet rounded="lg">
                            <v-divider class="my-2"></v-divider>
                            <v-list rounded="lg">
                                <v-list-item>
                                    <v-select label="Filter Search Criteria" :items="selection_criteria" variant="solo-filled"></v-select>
                                </v-list-item>
                                <v-list-item>
                                  <v-form v-model="form"
                                      @submit.prevent="mapping_store.onSubmit()">
                                    <v-text-field
                                      v-model="searchedValue"
                                      placeholder="Type in Searchable Value"
                                      label="Search"
                                      :rules="[required]"
                                      clearable: boolean=""
                                    ></v-text-field>
                                    <v-btn
                                      :disabled="!form"
                                      :loading="loading"
                                      block
                                      color="success"
                                      size="large"
                                      type="submit"
                                      variant="elevated">
                                      Submit
                                    </v-btn>
                                  </v-form>
                                </v-list-item>
                                <v-divider class="my-2"></v-divider>
                              <v-list-item>
                                <v-checkbox
                                  :model-value="surveyLayerCheckbox"
                                  label="Survey Layer"
                                  @change="mapping_store.surveyLayerCheck($event)"
                                ></v-checkbox>
                                <v-checkbox
                                  v-if="searchCount > 0"
                                  label="Searched Layer"
                                ></v-checkbox>
                              </v-list-item>
                            </v-list>
                        </v-sheet>
                    </v-col>
                    <v-col>
                        <MapComponent />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>
<script lang="ts" setup>
import MapComponent from "@/components/MapComponent.vue";
import { ref } from "vue";
import { useMappingStore } from "@/store/mapping";
import { storeToRefs } from "pinia";

const mapping_store = useMappingStore()
const { form, loading, searchedValue, searchCount, surveyLayerCheckbox } = storeToRefs(mapping_store)
const selection_criteria = ref([
    'Survey Numbers',
    'Partition Plats',
    'Township/Ranges',
    'Subdivisions',
    'Prepared For',
    'Prepared By'
  ])
function required (v: any) {
  return !!v || 'Field is required'
}


</script>

