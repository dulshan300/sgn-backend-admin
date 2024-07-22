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


const stream_url = ref("");
const program_name = ref("");
const program_list = ref([]);
const selected_program = ref("");

const langs = ref([]);
const selected_lang = ref("en");

const error_bag = ref({});

const backend_uri = import.meta.env.VITE_API_HOST;

const default_modal = {
  title: {},
  image: '',
  description: {},
  published: false,
  meta: {
    genre: {},
    url: '',
  }
}

const movie_form = ref(cloneObj(default_modal));

const selectProgram = async (p) => {
  selected_program.value = p;
  //   update settings

  await save_settings([
    {rooftop_next_program: p}
  ])

//   trigger wss

  wss_trigger_event('client-notifications', 'rooftop-live-program-change', p);
}

const updateStreamUrl = () => {
  console.log("updateStreamUrl");
  save_settings([
    {rooftop_live_stream_url: stream_url.value}
  ])
}

const playback_url = ref("");
const updatePlaybackUrl = () => {
  console.log("updatePlaybackUrl");
  save_settings([
    {rooftop_playback_url: playback_url.value}
  ])
}


const saveProgramList = () => {
  console.log("saveProgramList");

  save_settings([
    {rooftop_program_list: program_list.value}
  ])
}

const deleteProgram = (index) => {
  console.log("deleteProgram");
  program_list.value.splice(index, 1);
  saveProgramList();
}

const addProgram = () => {
  if (program_name.value.length > 0) {
    program_list.value.push(program_name.value);
    program_name.value = "";

    //   update settings
    saveProgramList();

  }
}


const isModalOpen = ref(false);
const movie_id = ref(null);

const closeModal = () => {
  isModalOpen.value = false;
  movie_form.value = cloneObj(default_modal);
  movie_id.value = null;
}

const openModal = (id = 0) => {
  if (id !== 0) {
    movie_id.value = id;
    api.get('/admin/rooftop/movies/' + id)
        .then(res => {
          movie_form.value = res.data.data;
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

  let url = '/admin/rooftop/movies';

  const data = new FormData();
  data.append('title', JSON.stringify(movie_form.value.title));
  data.append('type', 'rooftop_movie');
  data.append('image', movie_form.value.image);
  data.append('published', movie_form.value.published);
  data.append('description', JSON.stringify(movie_form.value.description));
  data.append('meta[genre]', JSON.stringify(movie_form.value.meta.genre));
  data.append('meta[url]', movie_form.value.meta.url);

  if (movie_id.value) {
    url += '/' + movie_id.value;

    api.put(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(res => {
          get_movies()
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
          get_movies()
          closeModal();
        })
        .catch(er => {
          error_bag.value = validation_errors_process(er)
        })

  }


}

const remove_movie = () => {

  api.delete('/admin/rooftop/movies/' + movie_id.value)
      .then(res => {
        get_movies()
        closeModal();
      })
      .catch(er => {
        error_bag.value = validation_errors_process(er)
      })

}

const handle_file = (e) => {
  console.log(e.target.files[0]);
  movie_form.value.image = e.target.files[0];
}

const movie_list = ref([]);

const get_movies = () => {

  api.get('/admin/rooftop/movies')
      .then(res => {
        // console.log(res.data);
        movie_list.value = res.data.data;
      })
      .catch(er => {
        error_bag.value = validation_errors_process(er)
      })

}

onMounted(async () => {

  const res = await get_settings(['rooftop_program_list', 'rooftop_next_program', 'rooftop_live_stream_url','rooftop_playback_url', 'languages']);

  program_list.value = res.rooftop_program_list;
  selected_program.value = res.rooftop_next_program;
  stream_url.value = res.rooftop_live_stream_url;
  langs.value = res.languages;
  playback_url.value = res.rooftop_playback_url;

//   get movies
  get_movies()


})


</script>

<template>


  <div class="flex gap-5 mt-6 flex-col md:flex-row">

    <div class="flex-1">
      <Card title="Local Movies">


        <div class="wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">


          <template v-for="i in movie_list">
            <div
                class="box cursor-pointer w-full flex justify-center items-center bg-gray-200 border aspect-video hover:shadow relative"
                @click="openModal(i._id)"
            >
              <img :src="i.image.length > 0 ?backend_uri+i.image:noImage" class="w-full h-full object-cover"/>
              <div class="info absolute inset-0">


                <div class="published bg-green-600/75 text-white absolute top-0 right-0 px-3">
                  {{ i.published ? 'Published' : 'Draft' }}
                </div>

                <div class="title bg-black/75 text-white absolute bottom-0 w-full px-3">{{ i.title['en'] }}</div>


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

    <div class="md:w-1/4 flex flex-col gap-10">
      <Card title="Live Stream URL">

        <div class="flex flex-col gap-5">
          <input v-model="stream_url" class="form-input w-full h-[50px] border border-gray-200 px-4 py-3 rounded-md"
                 type="text"
                 placeholder="https://youtube.com"/>
          <button @click="updateStreamUrl" class="btn btn-primary">Update</button>
        </div>

      </Card>

      <Card title="Playback URL">

        <div class="flex flex-col gap-5">
          <input v-model="playback_url" class="form-input w-full h-[50px] border border-gray-200 px-4 py-3 rounded-md"
                 type="text"
                 placeholder="https://youtube.com"/>
          <button @click="updatePlaybackUrl" class="btn btn-primary">Update</button>
        </div>

      </Card>

      <Card title="coming next Select">

        <ul>
          <template v-for="i, index in program_list">
            <li
                class="flex items-center px-5 py-3 cursor-pointer border-b last:border-none text-xl"
                :class="{'event_pulse':selected_program === i}"
            >
              <span @click="selectProgram(i)" class="flex-1">{{ i }}</span>
              <RiDeleteBinLine @click="deleteProgram(i)" class="ml-auto text-2xl text-red-500"/>
            </li>
          </template>
        </ul>

      </Card>

      <Card title="update coming next">
        <div class="flex flex-col gap-5">
          <input v-model="program_name" class="form-input w-full h-[50px] border border-gray-200 px-4 py-3 rounded-md"
                 type="text"
                 placeholder="Program Name"/>
          <button @click="addProgram" class="btn btn-primary">Add</button>
        </div>
      </Card>

    </div>

    <!-- add local movie  modal-->
    <Modal :isOpen="isModalOpen" :title="movie_id ? 'Edit Local Movie' : 'Add Local Movie'" @close="closeModal">

      <div class="flex gap-3 justify-end">
        <LangSelect v-model="selected_lang"/>
      </div>

      <form @submit.prevent="handle_submit">
        <!-- Title -->
        <div class="mb-4">
          <label for="title" class="block text-gray-700 font-bold mb-2">Title</label>
          <input v-model="movie_form.title[selected_lang]" type="text" id="title" name="title"
                 class="form-input">
          <input-error :errors="error_bag" field="title"/>

        </div>

        <!-- Genres -->
        <div class="mb-4">
          <label for="genres" class="block text-gray-700 font-bold mb-2">Genres</label>
          <input v-model="movie_form.meta.genre[selected_lang]" type="text" id="genres" name="genre"
                 class="form-input">
          <input-error :errors="error_bag" field="genre"/>
        </div>

        <!-- Feature Image -->
        <div class="mb-4">
          <label for="feature_image" class="block text-gray-700 font-bold mb-2">Poster</label>
          <input @change="handle_file" accept="image/*" type="file" id="feature_image" name="feature_image"
                 class="form-input">
        </div>

        <!-- URL -->
        <div class="mb-4">
          <label for="url" class="block text-gray-700 font-bold mb-2">URL</label>
          <input v-model="movie_form.meta.url" type="url" id="url" name="url"
                 class="form-input">
          <input-error :errors="error_bag" field="url"/>
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label for="description" class="block text-gray-700 font-bold mb-2">Description</label>
          <textarea v-model="movie_form.description[selected_lang]" id="description" name="description" rows="4"
                    class="textarea"></textarea>
          <input-error :errors="error_bag" field="description"/>
        </div>

        <div class="mb-4 flex items-center gap-2">
          <Toggle v-model:checked="movie_form.published"/>

          <label for="published" class="block text-gray-700 ">Published</label>
        </div>

        <!-- Submit Button -->
        <div class="mt-10 flex gap-10">

          <button v-if="movie_id" @click="remove_movie" type="button" class="btn btn-danger">Remove</button>

          <button :disabled="movie_form.isProcessing===true" type="submit"
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