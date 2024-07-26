<template>
  <div>

    <div class="flex justify-end mb-8">
      <div class="flex justify-end">
        <button class="btn btn-primary" @click="openModal(false)">Add a Recipes</button>
      </div>
    </div>

    <card>

      <template v-if="recipes.length == 0">
        <div class="flex w-full justify-center text-gray-500">
          No data found
        </div>
      </template>

      <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">

        <template v-for="i in recipes">

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

    <Modal :is-open="show_add_chef" @close="closeModal" title="Add / update Recipe">

      <div class="flex justify-end">
        <LangSelect v-model="lang"/>
      </div>


      <div class="flex flex-col gap-4">
        <div class="fg">
          <label class="fg-label">Main Title</label>
          <input v-model="model.title[lang]" class="form-input" type="text">
          <input-error :errors="error_bag" field="title"/>
        </div>
        <div class="fg">
          <label class="fg-label">Window Title</label>
          <input v-model="model.meta.window_title[lang]" class="form-input" type="text">
          <input-error :errors="error_bag" field="window_title"/>
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

          <a v-if="selected_recipe" class="text-sm text-blue-500 bg-blue-100 p-2 rounded text-center"
             :href="img_src(model.meta.pdf)">View PDF</a>
        </div>

        <div class="fg">
          <label class="fg-label">Class (optional)</label>
          <select v-model="model.meta.video" class="form-input">
            <option v-for="v in videos" :value="v._id">{{ v.title[lang] }}</option>
          </select>

        </div>

        <div class="fg">
          <label class="fg-label">Introduction</label>
          <QuillEditor ref="introduction_editor" :toolbar="toolbarOptions" @ready="introduction_editor_ready"
                       @update:content="introduction_editor_content_chagned"
                       theme="snow"/>
          <input-error :errors="error_bag" field="introduction"/>
        </div>

        <div class="fg">
          <label class="fg-label">Ingredients</label>
          <QuillEditor ref="ingredients_editor" :toolbar="toolbarOptions" @ready="ingredients_editor_ready"
                       @update:content="ingredients_editor_content_chagned"
                       theme="snow"/>
          <input-error :errors="error_bag" field="ingredients"/>
        </div>

        <div class="fg">
          <label class="fg-label">Method</label>
          <QuillEditor ref="method_editor" :toolbar="toolbarOptions" @ready="method_editor_ready"
                       @update:content="method_editor_content_chagned"
                       theme="snow"/>
          <input-error :errors="error_bag" field="method"/>
        </div>


      </div>


      <div class="flex justify-between gap-3 mt-10">
        <button v-if="selected_recipe" @click="handle_remove" class="btn btn-danger">Remove</button>
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
import {cloneObj, img_src, toolbarOptions, validation_errors_process} from "../Utils/helper.js";
import InputError from "../components/inputError.vue";
import LangSelect from "../components/LangSelect.vue";
import api from "../Utils/axios.js";
import {useRoute} from "vue-router";
import Card from "../components/Card.vue";

const error_bag = ref({});

const _defaultModal = {
  title: {en: ""},
  description: {en: ""},
  image: '',
  meta: {
    introduction: {en: ""},
    ingredients: {en: ""},
    method: {en: ""},
    window_title: {en: ""},

  },
  published: true
}

const route = useRoute();

const model = ref(cloneObj(_defaultModal));

const show_add_chef = ref(false);

const introduction_editor = ref(null);
const ingredients_editor = ref(null);
const method_editor = ref(null);

const lang = ref("en");


watch(lang, () => {
  introduction_editor.value.setHTML(model.value.meta.introduction[lang.value] ?? "");
  ingredients_editor.value.setHTML(model.value.meta.ingredients[lang.value] ?? "");
  method_editor.value.setHTML(model.value.meta.method[lang.value] ?? "");
});

const introduction_editor_ready = () => {
  introduction_editor.value.setHTML(model.value.meta.introduction[lang.value] ?? "");
}
const ingredients_editor_ready = () => {
  ingredients_editor.value.setHTML(model.value.meta.ingredients[lang.value] ?? "");
}
const method_editor_ready = () => {
  method_editor.value.setHTML(model.value.meta.method[lang.value] ?? "");
}

const openModal = (id) => {

  if (id) {
    const c = recipes.value.find(v => v._id === id);

    model.value = c;
    selected_recipe.value = c._id;
  }

  show_add_chef.value = true;
}
const closeModal = () => {
  error_bag.value = {};
  show_add_chef.value = false;
  model.value = cloneObj(_defaultModal);
  selected_recipe.value = null;

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

const introduction_editor_content_chagned = (delta, oldDelta, source) => {
  model.value.meta.introduction[lang.value] = introduction_editor.value.getHTML();
}
const ingredients_editor_content_chagned = (delta, oldDelta, source) => {
  model.value.meta.ingredients[lang.value] = ingredients_editor.value.getHTML();
}
const method_editor_content_chagned = (delta, oldDelta, source) => {
  model.value.meta.method[lang.value] = method_editor.value.getHTML();
}

const selected_recipe = ref(null);

const handle_submit = async () => {

  const data = new FormData();
  data.append("title", JSON.stringify(model.value.title));
  data.append("window_title", JSON.stringify(model.value.meta.window_title));
  data.append("image", cover_image.value);
  data.append("pdf", pdf.value);
  data.append("published", model.value.published);
  data.append("introduction", JSON.stringify(model.value.meta.introduction));
  data.append("ingredients", JSON.stringify(model.value.meta.ingredients));
  data.append("method", JSON.stringify(model.value.meta.method));
  data.append("video", model.value.meta.video);

  const id = route.params.id;

  try {
    if (!selected_recipe.value) {

      const res = await api.post(`/admin/chef/${id}/recipes`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      closeModal();
    } else {
      const res = await api.put(`/admin/chef/${id}/recipes/${selected_recipe.value}`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

    }
    get_recipes();

  } catch (e) {
    error_bag.value = validation_errors_process(e);
  }

  // closeModal();
}
const handle_remove = async () => {
  const id = route.params.id;

  if (confirm("This will remove all the videos and recipe. Are you sure?")) {
    const res = await api.delete(`/admin/chef/${id}/recipes/${selected_recipe.value}`);
    closeModal();
    get_recipes();
  }

}

const recipes = ref([]);

const get_recipes = async () => {
  const id = route.params.id;
  const res = await api.get(`/admin/chef/${id}/recipes`);
  recipes.value = res.data;
}

const videos = ref([]);

onMounted(async () => {
  await get_recipes()

//   get videos

  const res = await api.get(`/admin/chef/${route.params.id}/videos`);
  videos.value = res.data;
})

</script>

<style lang="scss" scoped>

</style>