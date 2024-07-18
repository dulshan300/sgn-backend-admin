<template>
  <div>

    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">

      <div class="flex justify-end mb-8">

        <div class="inline-flex justify-end">

          <button @click="openModal(0)" class="btn btn-primary">Add Quiz</button>

        </div>
      </div>

      <div class="table">
        <table>
          <thead>
          <tr>
            <th> #</th>
            <th> Questions</th>
            <th> Type</th>
            <th> Status</th>
            <th></th>
          </tr>
          </thead>

          <tbody>
          <template v-for="(quiz, index) in quiz_list">

            <tr>
              <td class="text-sm leading-5 text-gray-500"> {{ `${index + 1}`.padStart(2, '0') }}</td>

              <td>
                <p class="text-sm leading-5 text-gray-500">
                  {{ limit_text(quiz.title['en']) }}
                </p>
              </td>

              <td>
                <p class="text-sm leading-5 text-gray-500">
                  {{ quiz.meta.options.a.type }} / {{ quiz.meta.options.b.type }}
                </p>
              </td>

              <td>
                <span v-if="quiz.published"
                      class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">Published</span>
                <span v-if="!quiz.published"
                      class="inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">Draft</span>
              </td>

              <td class="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
                <button @click="openModal(quiz._id)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
              </td>

            </tr>

          </template>


          </tbody>
        </table>
      </div>
    </div>


    <Modal :is-open="isOpen" @close="closeModal" title="Add/Update Quiz">

      <div class="flex justify-end">
        <LangSelect v-model="selected_lang"/>
      </div>

      <form @submit.prevent="handle_submission">

        <div class="fg">
          <label>Question</label>
          <textarea v-model="quizModal.title[selected_lang]" type="text" class="form-input"></textarea>
          <input-error :errors="error_bag" field="question"/>
        </div>


        <div v-if="quizModal.image" class="template mt-5 mx-auto"
             :style="{backgroundImage: `url(${bg_image_src})`}"></div>


        <div class="fg mt-5">
          <label>Background Image</label>
          <input type="file" accept="image/*" @change="handle_image" class="form-input">
          <input-error :errors="error_bag" field="image"/>
        </div>

        <h4 class="my-5 ">Options</h4>

        <div class="flex flex-col gap-5 justify-between ">

          <div class="flex gap-3">
            <label class="mt-2">A</label>
            <div class="fg">
              <label>Question</label>
              <input v-model="quizModal.meta.options.a.text[selected_lang]" type="text" class="form-input">
            </div>
            <div class="fg">
              <label>Type</label>
              <select v-model="quizModal.meta.options.a.type" type="text" class="form-input">
                <option v-for="option in quiz_types ">{{ option }}</option>
              </select>
            </div>
          </div>
          <input-error :errors="error_bag" field="options_a"/>

          <div class="flex gap-3">
            <label class="mt-2">B</label>
            <div class="fg">
              <input v-model="quizModal.meta.options.b.text[selected_lang]" type="text" class="form-input">
            </div>
            <div class="fg">
              <select v-model="quizModal.meta.options.b.type" type="text" class="form-input">
                <option v-for="option in quiz_types ">{{ option }}</option>
              </select>
            </div>
          </div>
          <input-error :errors="error_bag" field="options_b"/>

        </div>

        <div class="mt-5 flex items-center gap-3">
          <Toggle v-model:checked="quizModal.published"/>
          <label> Published</label>
        </div>


        <div class="flex justify-end gap-10 mt-10">
          <button v-if="selected_quiz" @click="remove_quiz" type="button" class="btn btn-danger">Remove</button>
          <button class="btn btn-primary">Save</button>
        </div>

      </form>

    </Modal>
  </div>
</template>

<script setup>
import {useConfigStore} from "../stores/ConfigStore.js";
import {onMounted, ref} from "vue";
import {cloneObj, limit_text, validation_errors_process} from "../Utils/helper.js";
import LangSelect from "../components/LangSelect.vue";
import Modal from "../components/Modal.vue";
import InputError from "../components/inputError.vue";
import Toggle from "../components/Toggle.vue";
import noImage from '/no_image.png';
import api from "../Utils/axios.js";

const conf = useConfigStore();

const _defaultModal = {
  title: {en: "Question 01"},
  image: null,
  meta: {
    options: {
      a: {text: {en: "Answer 1"}, type: "NIL"},
      b: {text: {en: "Answer 1"}, type: "NIL"}
    },
  },
  description: {en: "Explanation 01"},
  published: false
}

const quiz_types = [
  "Laidback", "Ambitious", "Social", "Private", "Traditional", "Trendy", 'NIL'
]

const error_bag = ref({});
const quizModal = ref(cloneObj(_defaultModal))
const isOpen = ref(false)
const selected_lang = ref("en")

const quiz_list = ref([]);
const selected_quiz = ref(0);
const bg_image_src= ref(null);
const bg_file = ref(null);

const handle_image = (e) => {

  const files = e.target.files;

  if (files.length === 0) {
    bg_file.value = null;
    bg_image_src.value = noImage;
    return;
  }

  const file = e.target.files[0];
  bg_file.value = file;

  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = () => {
    bg_image_src.value = reader.result;
  }

}

const openModal = (_id = 0) => {
  if (_id !== 0) {
    selected_quiz.value = _id;
    quizModal.value = quiz_list.value.find(quiz => quiz._id === _id);
    bg_image_src.value = import.meta.env.VITE_API_HOST + quizModal.value.image;
  }
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
  quizModal.value = cloneObj(_defaultModal)
  selected_quiz.value = 0;
  error_bag.value = {};
  selected_lang.value = "en";
}

const handle_submission = async () => {
  error_bag.value = {};
  console.log(quizModal.value);

  const fd = new FormData();
  fd.append('title', JSON.stringify(quizModal.value.title));
  fd.append('meta', JSON.stringify(quizModal.value.meta));
  fd.append('published', quizModal.value.published);
  fd.append('image', bg_file.value);


  if (selected_quiz.value === 0) {

    await api.post('/admin/flavour-quiz', fd, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(res => {
          console.log(res);
          closeModal();
        })
        .catch(error => {
          console.log(error.response.data);
          error_bag.value = validation_errors_process(error)
        })

  } else {

    await api.put(`/admin/flavour-quiz/${selected_quiz.value}`, fd,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
        .then(res => {
          console.log(res);
          // closeModal();
        })
        .catch(error => {
          console.log(error.response.data);
          error_bag.value = validation_errors_process(error)
        })

  }

  await get_quiz();


}

const remove_quiz = async () => {
  await api.delete(`/admin/flavour-quiz/${selected_quiz.value}`)
  await get_quiz();
  closeModal();
}

const get_quiz = async () => {

  const res = await api.get('admin/flavour-quiz')
  console.log(res.data)
  quiz_list.value = res.data.data

}

onMounted(async ()=>{
  await get_quiz();
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