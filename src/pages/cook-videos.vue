<template>
  <div>

    <div class="flex justify-end mb-8">
      <div class="flex justify-end">
        <button class="btn btn-primary" @click="openModal(false)">Add a Video</button>
      </div>
    </div>

    <card>

      <template v-if="videos.length == 0">
        <div class="flex w-full justify-center text-gray-500">
          No data found
        </div>
      </template>

      <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">

        <template v-for="i in videos">

          <div @click="openModal(i._id)" :style="{backgroundImage: `url(${img_src(i.image)})`}"
               class="w-full h-32 bg-gray-100 bg-contain bg-no-repeat bg-center cursor-pointer relative">

            <div v-if="i.published" class="bg-green-600 px-2 py-1 text-white text-xs absolute top-0 right-0">Published
            </div>

            <div v-if="!i.published" class="bg-orange-600 px-2 py-1 text-white text-xs absolute top-0 right-0">Draft
            </div>

            <span
                class="w-full bg-black/70 text-white flex justify-center items-center absolute bottom-0">{{
                i.title['en']
              }}</span>


          </div>

        </template>


      </div>


    </card>

    <Modal :is-open="show_add_chef" @close="closeModal" title="Add / update Videos">

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
          <label class="fg-label">Dish Title</label>
          <input v-model="model.meta.dish_title[lang]" class="form-input" type="text">
          <input-error :errors="error_bag" field="dish_title"/>
        </div>

        <div class="fg">
          <label class="fg-label">Description</label>
          <QuillEditor ref="description_editor" :toolbar="toolbarOptions" @ready="editor_ready"
                       @update:content="content_chagned"
                       theme="snow"/>
          <input-error :errors="error_bag" field="description"/>
        </div>

        <div class="fg">
          <label class="fg-label">Recipe</label>
          <QuillEditor ref="recipe_editor" :toolbar="toolbarOptions" @ready="recipe_editor_ready"
                       @update:content="recipe_content_chagned"
                       theme="snow"/>
          <input-error :errors="error_bag" field="recipe"/>
        </div>

        <div class="fg">
          <label class="fg-label">Cover Image</label>
          <input @change="handleImage" class="form-input" type="file">
          <input-error :errors="error_bag" field="image"/>

        </div>

        <div class="fg">
          <label class="fg-label">PDF</label>
          <input @change="handlePdf" class="form-input" type="file">
          <input-error :errors="error_bag" field="pdf"/>

          <a v-if="selected_video && model.meta.pdf"
             class="text-sm text-blue-500 bg-blue-100 p-2 rounded text-center"
             :href="img_src(model.meta.pdf)" target="_blank">View PDF</a>
        </div>

        <div class="fg">
          <label class="fg-label">URL</label>
          <input v-model="model.meta.url" class="form-input" type="text">
          <input-error :errors="error_bag" field="url"/>
        </div>
<!-- 
        <div class="fg">
          <label class="fg-label">Show Recipe (Select to show recipe on video list)</label>
          <Toggle v-model:checked="model.meta.show_recipe"/>
        </div> -->

        <div class="fg mt-5">
          <label class="fg-label">Published <Toggle v-model:checked="model.published"/></label>
          
        </div>


      </div>


      <div class="flex justify-between gap-3 mt-10">
        <button v-if="selected_video" @click="handle_remove" class="btn btn-danger">Remove</button>
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
import {useRoute} from "vue-router";
import Card from "../components/Card.vue";
import Toggle from "../components/Toggle.vue";

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
  meta: {
    url: "",
    show_recipe: false,
    recipe: {en: ""},
    dish_title: {en: ""},
    pdf: ""
  },
  published: true
}

const route = useRoute();

const model = ref(cloneObj(_defaultModal));

const show_add_chef = ref(false);

const description_editor = ref(null);

const recipe_editor = ref(null);

const lang = ref("en");

watch(lang, () => {
  description_editor.value.setHTML(model.value.description[lang.value] ?? "");
});

const editor_ready = () => {
  description_editor.value.setHTML(model.value.description[lang.value] ?? "");
}

const content_chagned = (delta, oldDelta, source) => {
  model.value.description[lang.value] = description_editor.value.getHTML();
}

watch(lang, () => {
  recipe_editor.value.setHTML(model.value.meta.recipe[lang.value] ?? "");
});

const recipe_editor_ready = () => {
  recipe_editor.value.setHTML(model.value.meta.recipe[lang.value] ?? "");
}

const recipe_content_chagned = (delta, oldDelta, source) => {
  model.value.meta.recipe[lang.value] = recipe_editor.value.getHTML();
}


const openModal = (id) => {

  if (id) {
    const c = videos.value.find(v => v._id === id);

    model.value = c;
    selected_video.value = c._id;
  }

  show_add_chef.value = true;
}
const closeModal = () => {
  error_bag.value = {};
  show_add_chef.value = false;
  selected_video.value = null;
  model.value = cloneObj(_defaultModal);

};

const cover_image = ref(null)

const handleImage = (e) => {
  const files = e.target.files;

  if (files.length > 0) {
    cover_image.value = files[0];

  }
}

const pdf = ref(null)

const handlePdf = (e) => {
  const files = e.target.files;

  if (files.length > 0) {
    pdf.value = files[0];

  }
}


const selected_video = ref(null);

const handle_submit = async () => {

  const data = new FormData();
  data.append("title", JSON.stringify(model.value.title));
  data.append("dish_title", JSON.stringify(model.value.meta.dish_title));
  data.append("description", JSON.stringify(model.value.description));
  data.append("recipe", JSON.stringify(model.value.meta.recipe));
  data.append("image", cover_image.value);
  data.append("pdf", pdf.value);
  data.append("published", model.value.published);
  data.append("show_recipe", model.value.meta.show_recipe);
  data.append("url", model.value.meta.url);

  const id = route.params.id;

  try {
    if (!selected_video.value) {

      const res = await api.post(`/admin/chef/${id}/videos`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      closeModal();
    } else {
      const res = await api.put(`/admin/chef/${id}/videos/${selected_video.value}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

    }
    get_videos();

  } catch (e) {
    error_bag.value = validation_errors_process(e);
  }

  // closeModal();
}
const handle_remove = async () => {
  const id = route.params.id;

  if (confirm("This will remove all the videos and recipe. Are you sure?")) {
    const res = await api.delete(`/admin/chef/${id}/videos/${selected_video.value}`);
    closeModal();
    get_videos();
  }

}

const videos = ref([]);

const get_videos = async () => {
  const id = route.params.id;
  const res = await api.get(`/admin/chef/${id}/videos`);
  videos.value = res.data;
}

onMounted(async () => {
  await get_videos()
})

</script>

<style lang="scss" scoped>

</style>