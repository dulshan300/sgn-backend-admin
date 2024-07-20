<template>
  <div>

    <div class="flex justify-end mb-8">
      <div class="flex justify-end">
        <button class="btn btn-primary" @click="openModal(false)">Add a chef</button>
      </div>
    </div>

    <div class="flex flex-col mt-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div
            class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
          <table class="min-w-full">
            <thead>
            <tr>
              <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Name
              </th>
              <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Total Videos
              </th>
              <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                Total Recipes
              </th>

              <th class="px-6 py-3 border-b border-gray-200 bg-gray-50"></th>
            </tr>
            </thead>

            <tbody class="bg-white">
            <tr v-for="d in chefs">
              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div class="flex items-center">
                  <div class="flex-shrink-0 w-10 h-10">
                    <img class="w-10 h-10 rounded-full"
                         :src="img_src(d.chef.image)"
                         :alt="d.chef.title['en']">
                  </div>

                  <div class="ml-4">
                    <div class="text-sm leading-5 text-gray-500">
                      {{ d.chef.title['en'] }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">

                <div class="text-sm leading-5 text-gray-500">
                  <router-link class="bg-green-400 px-3 rounded-2xl text-white hover:bg-green-600" :to="{
                    name:'cooking-videos',
                    params: {id:d.chef._id}
                  }">{{
                      d.videos
                    }}
                  </router-link>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <div class="text-sm leading-5 text-gray-500">
                  <router-link class="bg-green-400 px-3 rounded-2xl text-white hover:bg-green-600" :to="{
                    name:'cooking-recipes',
                    params: {id:d.chef._id}
                  }">
                    {{ d.recipes }}
                  </router-link>
                </div>
              </td>

              <td
                  class="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
                <button @click="openModal(d.chef._id)" type="button" class="text-indigo-600 hover:text-indigo-900">Edit
                </button>
              </td>
            </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Modal :is-open="show_add_chef" @close="closeModal" title="Add / update Chef">

      <div class="flex justify-end">
        <LangSelect v-model="lang"/>
      </div>


      <div class="flex flex-col gap-1">
        <div class="fg">
          <label class="fg-label">Name</label>
          <input v-model="model.title[lang]" class="form-input" type="text">
          <input-error :errors="error_bag" field="title"/>
        </div>

        <div class="fg">
          <label class="fg-label">Description</label>
          <QuillEditor ref="description_editor" :toolbar="toolbarOptions" @ready="editor_ready"
                       @update:content="content_chagned"
                       theme="snow"/>

          <input-error :errors="error_bag" field="description"/>
        </div>

        <div class="fg">
          <label class="fg-label">Cover Image</label>
          <input @change="handleImage" class="form-input" type="file">
          <input-error :errors="error_bag" field="image"/>

        </div>
      </div>


      <div class="flex justify-between gap-3 mt-10">
        <button v-if="selected_chef" @click="handle_remove" class="btn btn-danger">Remove</button>
        <button @click="handle_submit" class="btn btn-primary">Save</button>
      </div>

    </Modal>

  </div>
</template>

<script setup>


import {onMounted, ref, watch} from "vue";
import Modal from "../components/Modal.vue";
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {cloneObj, img_src, validation_errors_process} from "../Utils/helper.js";
import InputError from "../components/inputError.vue";
import LangSelect from "../components/LangSelect.vue";
import api from "../Utils/axios.js";

const error_bag = ref({});

const toolbarOptions = ref([
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  ['link'],
  [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
  [{'script': 'sub'}, {'script': 'super'}],
  [{'indent': '-1'}, {'indent': '+1'}],

  [{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}],
  [{'font': []}],
  [{'align': []}],
  ['clean']
]);

const _defaultModal = {
  title: {en: ""},
  description: {en: ""},
  image: '',
  published: true
}

const model = ref(cloneObj(_defaultModal));

const show_add_chef = ref(false);

const description_editor = ref(null);

const lang = ref("en");

watch(lang, () => {
  description_editor.value.setHTML(model.value.description[lang.value] ?? "");
});

const editor_ready = () => {
  description_editor.value.setHTML(model.value.description[lang.value] ?? "");
}

const openModal = (id) => {

  if (id) {
    const c = chefs.value.find(d => d.chef._id === id);

    model.value = c.chef;
    selected_chef.value = c.chef._id;
  }

  show_add_chef.value = true;
}
const closeModal = () => {
  error_bag.value = {};
  show_add_chef.value = false;
  model.value = cloneObj(_defaultModal);
  selected_chef.value = null;

};

const cover_image = ref(null)

const handleImage = (e) => {
  const files = e.target.files;

  if (files.length > 0) {
    cover_image.value = files[0];

  }
}

const content_chagned = (delta, oldDelta, source) => {
  // console.log(description_editor.value.getHTML());

  model.value.description[lang.value] = description_editor.value.getHTML();
}

const selected_chef = ref(null);

const handle_submit = async () => {

  const data = new FormData();
  data.append("title", JSON.stringify(model.value.title));
  data.append("description", JSON.stringify(model.value.description));
  data.append("image", cover_image.value);
  data.append("published", model.value.published);

  try {
    if (!selected_chef.value) {

      const res = await api.post("/admin/chef", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      closeModal();
    } else {

      const res = await api.put(`/admin/chef/${selected_chef.value}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

    }
    get_chef();

  } catch (e) {
    error_bag.value = validation_errors_process(e);
  }

  // closeModal();
}
const handle_remove = async () => {

  if (confirm("This will remove all the videos and recipe. Are you sure?")) {
    const res = await api.delete(`/admin/chef/${selected_chef.value}`);
    closeModal();
    get_chef();
  }

}

const chefs = ref([]);

const get_chef = async () => {
  const res = await api.get("/admin/chef");
  chefs.value = res.data;
}

onMounted(async () => {
  await get_chef()
})

</script>

<style lang="scss" scoped>

</style>