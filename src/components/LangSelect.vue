<template>
  <div class="langs flex gap-3">

    <button @click.prevent="model=i"
            class="lang bg-gray-200 flex w-7 h-7 text-sm justify-center items-center rounded"
            :class="{'underline font-bold':model===i}"
            v-for="i in langs">
      {{ i }}
    </button>
  </div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import {get_settings} from "../Utils/helper.js";
import {useConfigStore} from "../stores/ConfigStore.js";

const langs = ref([]);

onMounted(async () => {
  const config = useConfigStore();
  langs.value = config.langs;
})

const model = defineModel()

</script>

<style lang="scss" scoped>

</style>