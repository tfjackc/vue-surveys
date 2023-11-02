<template>
  <v-app-bar flat height="92">
    <v-container class="mx-auto d-flex align-center justify-center">

      <v-icon size="80">
        <v-img
          src="src/assets/cc_logo.png"
        ></v-img>
      </v-icon>

      <v-btn
        v-for="link in links"
        :key="link"
        :text="link"
        variant="text"
      ></v-btn>

      <v-spacer></v-spacer>

      <v-responsive max-width="160">
        <v-text-field
          density="compact"
          flat
          hide-details
          label="Search"
          rounded="lg"
          single-line
          variant="solo-filled"
        ></v-text-field>
      </v-responsive>
    </v-container>
  </v-app-bar>
</template>

<script lang="ts" setup>
import {ref} from "vue";

const links = ref([
  'Dashboard',
  'Messages',
  'Profile',
  'Updates',
])
</script>
