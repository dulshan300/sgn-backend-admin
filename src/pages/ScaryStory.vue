<template>
  <div class="">

    <div class="flex justify-end mb-8">
      <div class="flex justify-end">
        <button @click="openModal" class="btn btn-primary">Add Story</button>
      </div>
    </div>

    <card>


      <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">

        <div @click="openEditModal(i)" v-for="i in stories" :style="{backgroundImage: `url(${img_src(i.image)})`}"
             class="w-full h-32 bg-gray-100 bg-contain bg-no-repeat bg-center cursor-pointer relative">

          <div v-if="i.published" class="bg-green-600 px-2 py-1 text-white text-xs absolute top-0 right-0">Published
          </div>
          <div v-if="!i.published" class="bg-orange-600 px-2 py-1 text-white text-xs absolute top-0 right-0">Draft</div>

          <span class="w-full bg-black/70 text-white flex justify-center items-center absolute bottom-0">{{i.title['en']}}</span>


        </div>

      </div>

      <!--pagination-->

    </card>

    <Modal :is-open="is_open" @close="closeModal" title="Add/Update Story">

      <div class="flex justify-end">

        <LangSelect v-model="langs"/>

      </div>

      <form @submit.prevent="handle_submission" class="flex gap-10">

        <div class="">
          <div class="poster w-[200px] h-[300px] bg-top bg-contain bg-no-repeat" :style="{backgroundImage: `url(${poster})`}"></div>
          <a class="flex justify-center p-2 mt-5 bg-sky-400/50 " :href="img_src(scaryModal.meta.pdf)" target="_blank">View pdf</a>
        </div>

        <div class="form flex-1 flex flex-col gap-5">

          <div class="fg">
            <label>Title</label>
            <input v-model="scaryModal.title[langs]" type="text" class="form-input">
            <input-error :errors="error_bag" field="title"/>
          </div>

          <div class="fg">
            <label>Description</label>
            <textarea v-model="scaryModal.description[langs]" type="text" class="form-input"></textarea>
            <input-error :errors="error_bag" field="description"/>
          </div>

          <div class="fg ">
            <label>Poster</label>
            <input ref="in_image" @change="handle_template" type="file" accept="image/*" class="form-input">
            <input-error :errors="error_bag" field="image"/>
          </div>

          <div class="fg ">
            <label>PDF</label>
            <input ref="in_pdf" @change="handle_pdf" type="file" accept="application/pdf" class="form-input">
            <input-error :errors="error_bag" field="pdf"/>
          </div>

          <div class="flex items-center gap-2 ">
            <Toggle v-model:checked="scaryModal.published"/>
            Published
          </div>

          <div class="flex justify-end gap-10 mt-10">

            <button v-if="story_id" type="button" @click="remove_scary" class="btn btn-danger">Delete</button>
            <button class="btn btn-primary">Save</button>
          </div>

        </div>


      </form>
    </Modal>


  </div>
</template>

<script setup>

import Card from "../components/Card.vue";
import {onMounted, ref} from "vue";
import Modal from "../components/Modal.vue";
import Toggle from "../components/Toggle.vue";
import InputError from "../components/inputError.vue";
import api from "../Utils/axios.js";
import {cloneObj, img_src, validation_errors_process} from "../Utils/helper.js";
import LangSelect from "../components/LangSelect.vue";
import {useConfigStore} from "../stores/ConfigStore.js";

const cnf = useConfigStore();
const langs = ref('en');
const error_bag = ref({});

const no_image = "https://placehold.co/264x407";
const poster = ref(no_image);

const default_modal = {
  title: {en: ``},
  image: '',
  description: {en: ""},
  meta: {
    pdf: "",
  },
  published: true
}

const tp_file = ref(null);
const pdf_file = ref(null);
const in_image = ref(null);
const in_pdf = ref(null);

const scaryModal = ref(cloneObj(default_modal));

const is_open = ref(false);

const openModal = (id) => {
  is_open.value = true;
}

const clearModal = () => {
  scaryModal.value = cloneObj(default_modal);
  tp_file.value = null;
  pdf_file.value = null;
  in_image.value.value = null;
  in_pdf.value.value = null;
  story_id.value = null;
  error_bag.value = {};
}

const closeModal = () => {
  is_open.value = false;
  clearModal();
}

const handle_template = async (e) => {

  const files = e.target.files;

  if (files.length === 0) {
    tp_file.value = null;
    poster.value = noImage;
    return;
  }

  cnf.setLoading(true);

  const file = e.target.files[0];
  tp_file.value = file;

  const reader = new FileReader();

  await reader.readAsDataURL(file);
  reader.onload = () => {
    poster.value = reader.result;
  }

  cnf.setLoading(false);

}

const handle_pdf = (e) => {
  cnf.setLoading(true);
  const file = e.target.files[0];
  pdf_file.value = file;
  cnf.setLoading(false);
}

const stories = ref([]);

const get_templates = async () => {
  const res = await api.get("/admin/stories");
  console.log(res.data);
  stories.value = res.data;
}

const handle_submission = () => {
  error_bag.value = {};
  const fd = new FormData();
  fd.append('title', JSON.stringify(scaryModal.value.title));
  fd.append('description', JSON.stringify(scaryModal.value.description));
  fd.append('published', scaryModal.value.published);
  fd.append('image', tp_file.value);
  fd.append('pdf', pdf_file.value);

  if (story_id.value) {
    //   update

    api.put(`/admin/story/${story_id.value}`, fd, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      get_templates();
      clearModal();
    })
        .catch(err => {
          error_bag.value = validation_errors_process(err)
        })

  } else {
    //   new

    api.post("/admin/story", fd, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      get_templates();
      clearModal();
    })
        .catch(err => {
          error_bag.value = validation_errors_process(err)
        })

  }


}

const story_id = ref(null);

const openEditModal = (t) => {
  // add selected story to modal
  scaryModal.value = cloneObj(t);
  poster.value = img_src(t.image);
  story_id.value = t._id;
  is_open.value = true

}


const remove_scary = () => {
  api.delete(`/admin/stories/${story_id.value}`)
      .then(() => {
        get_templates();
        closeModal()  ;
      })
}


const updateTemplate = () => {

  api.put(`/admin/coloring/${story_id.value._id}`, {
    published: story_id.value.published
  })
      .then(() => {
        get_templates();
      })
}

onMounted(async () => {
  await get_templates();
})

</script>

<style lang="scss" scoped>

.template {
  width: 300px;
  aspect-ratio: 16/9;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

</style>