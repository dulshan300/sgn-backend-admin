<template>
  <div class="flex flex-col gap-6 mt-10">

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

      <Card title="Multi-language">


        <div class="flex flex-col gap-3">

          <div v-for="language in multi_language" class="flex justify-between p-2 bg-gray-200 rounded">
            <span class="font-bold">{{ language }}</span>
            <button @click="multi_language.splice(multi_language.indexOf(language), 1)">
              <RiDeleteBin6Line class="w-4 h-4"/>
            </button>
          </div>

        </div>


        <div class="form mt-5">


          <div class="form-group">
            <input v-model="lang" @keydown.enter="add_language" type="text" class="form-input"
                   placeholder="Add Language ex: EN">
            <button @click="add_language" class="btn btn-primary mt-3">Add</button>
          </div>
        </div>

      </Card>

      <div class="dummy"></div>
      <div class="dummy"></div>
      <div class="dummy"></div>

    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">


      <div class="dummy"></div>
      <div class="dummy"></div>

    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

      <div class="dummy"></div>
      <div class="dummy"></div>
      <div class="dummy"></div>
      <div class="dummy"></div>

    </div>

  </div>
</template>

<script setup>

import Card from "../components/Card.vue";
import {RiDeleteBin6Line} from "@remixicon/vue";
import {onMounted, ref, watch} from "vue";
import api from "../Utils/axios.js";
import {get_settings, save_settings} from "../Utils/helper.js";

const multi_language = ref([]);
const lang = ref("");
const add_language = () => {

  console.log(lang.value)

  if (lang.value) {
    multi_language.value.push(lang.value);
    lang.value = '';
  }

}

onMounted(async () => {

  const res = await get_settings(['languages']);

  if (res.languages) {
    multi_language.value = res.languages
  }

})

watch(multi_language, () => {
  console.log(multi_language.value);

  save_settings([
    {languages: multi_language.value}
  ])


}, {deep: true});

</script>

<style lang="scss" scoped>

.dummy {
  background: rgba(gray, 0.1);
  border-radius: 7px;
  min-height: 150px;
}

</style>