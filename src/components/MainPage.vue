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

                <TableComponent />


        </v-main>
    </v-app>
</template>
<script lang="ts" setup>
import MapComponent from "@/components/MapComponent.vue";
import LayerList from "@/components/LayerList.vue";
import Search from "@/components/Search.vue";
import TableComponent from "@/components/TableComponent.vue";
</script>

