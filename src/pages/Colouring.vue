<template>
  <div class="">

    <div class="flex justify-end mb-8">
      <div class="flex justify-end">
        <button @click="openModal" class="btn btn-primary">Add Template</button>
      </div>
    </div>

    <card title="Templates">


      <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">

        <div @click="openEditModal(i)" v-for="i in templates" :style="{backgroundImage: `url(${img_base+i.image})`}"
             class="w-full h-32 bg-gray-100 bg-contain bg-no-repeat bg-center cursor-pointer relative">

          <div v-if="i.published" class="bg-green-600 px-2 py-1 text-white text-xs absolute top-0 right-0">Published
          </div>

          <div v-if="!i.published" class="bg-orange-600 px-2 py-1 text-white text-xs absolute top-0 right-0">Draft</div>


        </div>

      </div>

      <!--pagination-->

    </card>

    <Modal :is-open="is_open" @close="closeModal" title="Add/Update Template">
      <form @submit.prevent="handle_submission">
        <div class="flex items-center gap-2 justify-center">
          <Toggle v-model:checked="tpModel.published"/>
          Published
        </div>

        <div v-if="tpModel.image" class="template mt-5 mx-auto"
             :style="{backgroundImage: `url(${tpModel.image})`}"></div>

        <div class="fg mt-5">
          <label>Template</label>
          <input ref="in_image" @change="handle_template" type="file" accept="image/svg+xml" class="form-input">
          <input-error :errors="error_bag" field="image"/>
        </div>

        <div class="fg mt-5">
          <label>Logo</label>
          <input ref="in_image" @change="handle_logo" type="file" accept="image/*" class="form-input">
          <input-error :errors="error_bag" field="logo"/>
        </div>

        <div class="fg mt-5">
          <label>PDF</label>
          <input ref="in_pdf" @change="handle_pdf" type="file" accept="application/pdf" class="form-input">
          <input-error :errors="error_bag" field="pdf"/>
        </div>


        <div class="flex justify-end gap-10 mt-10">
          <button class="btn btn-primary">Save</button>
        </div>
      </form>
    </Modal>

    <Modal :is-open="is_edit_open" @close="closeEditModal" title="Edit Template">
      <div class="flex items-center gap-2 justify-center">
        <Toggle v-model:checked="selected_temp.published"/>
        Published
      </div>

      <div class="flex justify-end gap-10 mt-10">
        <button @click="remvoeTemplate" class="btn btn-danger">Remove</button>
        <button @click="updateTemplate" class="btn btn-primary">Save</button>
      </div>


    </Modal>

  </div>
</template>

<script setup>

import Card from "../components/Card.vue";
import noImage from '/no_image.png';
import {onMounted, ref} from "vue";
import Modal from "../components/Modal.vue";
import Toggle from "../components/Toggle.vue";
import InputError from "../components/inputError.vue";
import api from "../Utils/axios.js";
import {cloneObj, validation_errors_process} from "../Utils/helper.js";

const error_bag = ref({});
const img_base = import.meta.env.VITE_API_HOST;

const default_modal = {
  title: {en: `tp_${Date.now()}`},
  image: '',
  meta: {
    pdf: "",
  },
  published: true
}

const tp_file = ref(null);
const pdf_file = ref(null);
const logo_file = ref(null);
const in_image = ref(null);
const in_pdf = ref(null);

const tpModel = ref(cloneObj(default_modal));

const is_open = ref(false);

const openModal = (id) => {
  is_open.value = true;
}

const clearModal = () => {
  tpModel.value = cloneObj(default_modal);
  tpModel.value.title['en'] = `tp_${Date.now()}`
  tp_file.value = null;
  pdf_file.value = null;
  in_image.value.value = null;
  in_pdf.value.value = null;
}
const closeModal = () => {
  is_open.value = false;
  clearModal();
}

const handle_template = (e) => {

  const files = e.target.files;

  if (files.length === 0) {
    tp_file.value = null;
    tpModel.value.image = noImage;
    return;
  }

  const file = e.target.files[0];
  tp_file.value = file;

  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = () => {
    tpModel.value.image = reader.result;
  }

}

const handle_pdf = (e) => {
  const file = e.target.files[0];
  pdf_file.value = file;
}

const handle_logo = (e) => {
  const file = e.target.files[0];
  logo_file.value = file;
}

const templates = ref([]);
const get_templates = async () => {
  const res = await api.get("/admin/coloring");
  console.log(res.data);
  templates.value = res.data;
}
const handle_submission = () => {
  error_bag.value = {};
  const fd = new FormData();
  fd.append('title', JSON.stringify(tpModel.value.title));
  fd.append('published', tpModel.value.published);
  fd.append('image', tp_file.value);
  fd.append('pdf', pdf_file.value);
  fd.append('logo', logo_file.value);

  api.post("/admin/coloring", fd, {
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

const selected_temp = ref({});

const is_edit_open = ref(false);

const openEditModal = (t) => {
  is_edit_open.value = true
  selected_temp.value = t;
}
const closeEditModal = () => {
  is_edit_open.value = false
  selected_temp.value = {};
}

const remvoeTemplate = () => {
  api.delete(`/admin/coloring/${selected_temp.value._id}`)
      .then(() => {
        get_templates();
        closeEditModal();
      })
}
const updateTemplate = () => {

  api.put(`/admin/coloring/${selected_temp.value._id}`, {
    published: selected_temp.value.published
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