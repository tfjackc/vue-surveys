<template>
  <div ref="mapDiv" class="map-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMappingStore } from "@/store/mapping";
import { surveyLayer } from "@/data/layers";
const app = useMappingStore()
const mapDiv = ref<HTMLDivElement>()

onMounted(async() => {
  await app.createMap(mapDiv.value!)
  await app.addLayerToMap(surveyLayer)
})
</script>
