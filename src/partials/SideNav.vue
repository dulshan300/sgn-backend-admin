<template>


  <div :class="sidebarOpen ? 'block' : 'hidden'" @click="sidebarOpen = false"
       class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>

  <div :class="sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
       class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0">
    <div class="flex items-center justify-center mt-8">
      <div class="flex items-center">
        <img src="/fav.svg" class="w-12 h-12" alt="">

        <span class="mx-2 text-2xl font-semibold text-white">Admin</span>
      </div>
    </div>

    <nav class="mt-10">

      <template v-for="link in navi">

        <router-link :to="link.path"
                     class="flex items-center px-6 py-4 mt-1 text-gray-100 hover:bg-gray-600 hover:bg-opacity-25"
                     :class="route.path === link.path ? 'bg-gray-600 bg-opacity-25' : ''"
        >
          <component :is="link.meta.icon"></component>

          <span class="mx-3">{{ link.meta.title }}</span>
        </router-link>

      </template>


    </nav>
  </div>


</template>

<script setup>

import navi from "../routes/navi.js";
import {useRoute} from "vue-router";

const route = useRoute();

defineProps({
  sidebarOpen: Boolean
})

</script>

<style lang="scss" scoped></style>