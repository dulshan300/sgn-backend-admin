<template>
  <div class="flex h-screen bg-gray-200 relative">
    <!--loading is here-->
    <transition>

      <div v-if="configStore.isLoading"
           class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div class="bg-white px-4 py-2 rounded flex items-center gap-3">
          <div class="spinner"></div>
          Processing
        </div>
      </div>
    </transition>

    <SideNav :sidebarOpen="sidebarOpen"/>

    <div class="flex flex-col flex-1 overflow-hidden">
      <TopNav @sidebarOpen="sidebarOpen = !sidebarOpen"/>

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div class="container px-6 py-8 mx-auto">
          <h3 class="text-3xl font-medium text-gray-700">{{ route.meta.title }}</h3>

          <RouterView :key="route.fullPath"/>


        </div>
      </main>
    </div>
  </div>


</template>

<script setup>
import {onMounted, ref} from 'vue';
import TopNav from '../partials/TopNav.vue';
import SideNav from '../partials/SideNav.vue';
import {useRoute, useRouter} from "vue-router";
import {useConfigStore} from "../stores/ConfigStore.js";
import {useToast} from "vue-toastification";
import {get_settings} from "../Utils/helper.js";


const sidebarOpen = ref(false)


const route = useRoute()
const toast = useToast()

const configStore = useConfigStore();

onMounted(async () => {

  const lang = await get_settings(['languages']);
  configStore.langs = (lang.languages);

  if (configStore.channel) {
    configStore.channel.bind('new-chat-pending', (data) => {
      toast.info(`New chat approval request`)
    })
  }


})


</script>

<style lang="scss" scoped>

.spinner {
  width: 56px;
  height: 56px;
  border: 11.2px #474bff double;
  border-left-style: solid;
  border-radius: 50%;
  animation: spinner-aib1d7 0.75s infinite linear;
}

@keyframes spinner-aib1d7 {
  to {
    transform: rotate(360deg);
  }
}


</style>