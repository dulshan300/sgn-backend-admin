<script setup>

import Card from "../components/Card.vue";
import {RiDeleteBinLine} from "@remixicon/vue";
import {onMounted, ref} from "vue";
import api from "../Utils/axios.js";
import {cloneObj, get_settings, save_settings, validation_errors_process, wss_trigger_event} from "../Utils/helper.js";
import {RiAddLargeLine} from '@remixicon/vue';
import Modal from "../components/Modal.vue";

import Toggle from "../components/Toggle.vue";
import InputError from "../components/inputError.vue";

import noImage from '/no_image.png';
import LangSelect from "../components/LangSelect.vue";


const langs = ref([]);
const selected_lang = ref("en");

const error_bag = ref({});

const backend_uri = import.meta.env.VITE_API_HOST;

const default_modal = {
  title: {},
  image: '',
  description: {},
  published: true,
  meta: {
    name: {},
    url: '',
  }
}

const athleModel = ref(cloneObj(default_modal));

const isModalOpen = ref(false);
const athle_id = ref(null);

const closeModal = () => {
  console.log("closeModal");
  isModalOpen.value = false;
  athleModel.value = cloneObj(default_modal);
  athle_id.value = null;
  selected_lang.value = "en";

}

const openModal = async (id = 0) => {
  if (id !== 0) {
    athle_id.value = id;
    await api.get('/admin/fitness/athletes/' + id)
        .then(res => {
          athleModel.value = res.data.data;
          isModalOpen.value = true;
        })
        .catch(er => {
          error_bag.value = validation_errors_process(er)
        })
  }

  isModalOpen.value = true;


}


const handle_submit = () => {

  error_bag.value = {};

  let url = '/admin/fitness/athletes';

  const data = new FormData();
  data.append('title', JSON.stringify(athleModel.value.title));
  data.append('image', athleModel.value.image);
  data.append('published', athleModel.value.published);
  data.append('description', JSON.stringify(athleModel.value.description));
  data.append('meta[url]', athleModel.value.meta.url);
  data.append('meta[name]', JSON.stringify(athleModel.value.meta.name));

  if (athle_id.value) {
    url += '/' + athle_id.value;

    api.put(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(res => {
          get_athletes()
          closeModal();
        })
        .catch(er => {
          error_bag.value = validation_errors_process(er)
        })

  } else {
    api.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(res => {
          get_athletes()
          closeModal();
        })
        .catch(er => {
          error_bag.value = validation_errors_process(er)
        })

  }


}

const remove_deal = () => {

  api.delete('/admin/fitness/athletes/' + athle_id.value)
      .then(res => {
        get_athletes()
        closeModal();
      })
      .catch(er => {
        error_bag.value = validation_errors_process(er)
      })

}

const handle_file = (e) => {
  console.log(e.target.files[0]);
  athleModel.value.image = e.target.files[0];
}

const athletes_list = ref([]);

const get_athletes = async () => {

  await api.get('/admin/fitness/athletes')
      .then(res => {
        // console.log(res.data);
        athletes_list.value = res.data.data;
      })
      .catch(er => {
        error_bag.value = validation_errors_process(er)
      })

}

onMounted(async () => {

  const res = await get_settings(['languages']);
  langs.value = res.languages;

//   get movies
  await get_athletes()


})


</script>

<template>


  <div class="flex gap-5 mt-6 flex-col md:flex-row">


    <div class="flex-1">

      <Card title="athletes">

        <div class="wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">


          <template v-for="i in athletes_list">
            <div
                class="box cursor-pointer w-full flex justify-center items-center bg-gray-200 border aspect-video hover:shadow relative"
                @click="openModal(i._id)"
            >
              <img :src="i.image.length > 0 ?backend_uri+i.image:noImage" class="w-full h-full object-cover"/>
              <div class="info absolute inset-0">


                <div class="published bg-green-600/75 text-white absolute top-0 right-0 px-3">
                  {{ i.published ? 'Published' : 'Draft' }}
                </div>

                <div class="title bg-black/75 text-white absolute bottom-0 w-full px-3">{{ i.meta.name['en'] }}</div>


              </div>
            </div>
          </template>


          <div @click="openModal(0)"
               class="box cursor-pointer w-full flex justify-center items-center bg-gray-200 border aspect-video hover:shadow">
            <RiAddLargeLine class="w-10 h-10 text-gray-500"/>
          </div>

        </div>

      </Card>
    </div>


    <!-- add local movie  modal-->
    <Modal :isOpen="isModalOpen" :title="athle_id ? 'Edit Athletes' : 'Add Athletes'" @close="closeModal">

      <div class="flex gap-3 justify-end">
        <LangSelect v-model="selected_lang"/>
      </div>

      <form @submit.prevent="handle_submit">
        <!-- Title -->
        <div class="mb-4">
          <label for="name" class="block text-gray-700 font-bold mb-2">Name</label>
          <input v-model="athleModel.meta.name[selected_lang]" type="text" id="name" name="title"
                 class="form-input">
          <input-error :errors="error_bag" field="name"/>

        </div>

        <div class="mb-4">
          <label for="title" class="block text-gray-700 font-bold mb-2">Title</label>
          <input v-model="athleModel.title[selected_lang]" type="text" id="title" name="title"
                 class="form-input">
          <input-error :errors="error_bag" field="title"/>

        </div>


        <!-- Feature Image -->
        <div class="mb-4">
          <label for="feature_image" class="block text-gray-700 font-bold mb-2">Poster</label>
          <input @change="handle_file" accept="image/*" type="file" id="feature_image" name="feature_image"
                 class="form-input">
          <input-error :errors="error_bag" field="image"/>
        </div>

        <!-- URL -->
        <div class="mb-4">
          <label for="url" class="block text-gray-700 font-bold mb-2">URL</label>
          <input v-model="athleModel.meta.url" type="url" id="url" name="url"
                 class="form-input">
          <input-error :errors="error_bag" field="url"/>
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label for="description" class="block text-gray-700 font-bold mb-2">Description</label>
          <textarea v-model="athleModel.description[selected_lang]" id="description" name="description" rows="4"
                    class="textarea"></textarea>
          <input-error :errors="error_bag" field="description"/>
        </div>

        <div class="mb-4 flex items-center gap-2">
          <Toggle v-model:checked="athleModel.published"/>

          <label for="published" class="block text-gray-700 ">Published</label>
        </div>

        <!-- Submit Button -->
        <div class="mt-10 flex gap-10">

          <button v-if="athle_id" @click="remove_deal" type="button" class="btn btn-danger">Remove</button>

          <button :disabled="athleModel.isProcessing===true" type="submit"
                  class="btn btn-primary">
            Submit
          </button>


        </div>
      </form>


    </Modal>

  </div>


</template>

<style scoped lang="scss">

</style>