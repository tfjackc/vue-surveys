<template>
    <v-app id="inspire">
        <v-main class="bg-grey-lighten-3">
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
                                    <v-text-field density="compact" flat hide-details label="Search" rounded="lg" single-line variant="solo-filled"></v-text-field>
                                </v-list-item>
                                <v-list-item>
                                    <v-btn> SEARCH </v-btn>

                                </v-list-item>
                                <v-divider class="my-2"></v-divider>
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
import {
    ref
} from "vue";
const selection_criteria = ref(['Survey Numbers', 'Partition Plats', 'Township/Ranges', 'Subdivisions', 'Prepared For', 'Prepared By'])
</script>
