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

      <card>

        <span class="card-title">Roof Top</span>

        <div class="grid grid-cols-2 gap-3 mb-5">
          <label>Comming Soon</label>
          <Toggle v-model:checked="rf_coming_soon"/>

        </div>

        <span class="card-title">Fitness Corner</span>
        <div class="grid grid-cols-2 gap-3 mb-5">
          <label>Comming Soon</label>
          <Toggle v-model:checked="fc_coming_soon"/>

          <label>Browse Videos</label>
          <Toggle v-model:checked="fc_browse_videos"/>

        </div>

        <span class="card-title">Pass the Remote</span>
        <div class="grid grid-cols-2 gap-3">
          <label>Hostspot Visibility</label>
          <Toggle v-model:checked="pr_is_visible"/>

        </div>


      </card>





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
import Toggle from "../components/Toggle.vue";

const multi_language = ref([]);
const lang = ref("");
const add_language = () => {

  console.log(lang.value)

  if (lang.value) {
    multi_language.value.push(lang.value);
    lang.value = '';
  }

}

const fc_coming_soon = ref(false);
const fc_browse_videos = ref(false);

watch(fc_browse_videos, () => {
  console.log(fc_browse_videos.value);
  save_settings([
    {fc_browse_videos: fc_browse_videos.value}
  ])
});

watch(fc_coming_soon, () => {
  console.log(fc_coming_soon.value);
  save_settings([
    {fc_coming_soon: fc_coming_soon.value}
  ])
});


const rf_coming_soon = ref(false);
watch(rf_coming_soon, () => {
  console.log(rf_coming_soon.value);
  save_settings([
    {rf_coming_soon: rf_coming_soon.value}
  ])
});

const pr_is_visible = ref(false);
watch(pr_is_visible, () => {
  console.log(pr_is_visible.value);
  save_settings([
    {pr_is_visible: pr_is_visible.value}
  ])
});

onMounted(async () => {

  const res = await get_settings(['languages','fc_browse_videos','fc_coming_soon','rf_coming_soon','pr_is_visible']);

  if (res.languages) {
    multi_language.value = res.languages
    fc_coming_soon.value = res.fc_coming_soon
    fc_browse_videos.value = res.fc_browse_videos
    rf_coming_soon.value = res.rf_coming_soon
    pr_is_visible.value = res.pr_is_visible
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