<template>
  <div class="flex flex-col mt-8">
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
            <th> Status</th>
            <th></th>
          </tr>
          </thead>

          <tbody>
          <template v-for="(quiz, index) in quiz_list">

            <tr>
              <td> {{ `${index + 1}`.padStart(2, '0') }}</td>

              <td>
                <p class="text-sm leading-5 text-gray-500">
                  {{ quiz.title['en'] }}
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
          <input v-model="quizModal.title[selected_lang]" type="text" class="form-input">
          <input-error :errors="error_bag" field="question"/>
        </div>


        <h4 class="mt-5">Answers</h4>

        <div class="flex flex-col gap-5 justify-between ">

          <div class="flex gap-3">
            <div class="fg">
              <label> A</label>
              <input v-model="quizModal.meta.options.a[selected_lang]" type="text" class="form-input">
              <input-error :errors="error_bag" field="options_a"/>

            </div>
            <div class="fg">
              <label> B</label>
              <input v-model="quizModal.meta.options.b[selected_lang]" type="text" class="form-input">
              <input-error :errors="error_bag" field="options_b"/>

            </div>
          </div>

          <div class="flex-1 flex gap-3">
            <div class="fg">
              <label> C</label>
              <input v-model="quizModal.meta.options.c[selected_lang]" type="text" class="form-input">
              <input-error :errors="error_bag" field="options_c"/>
            </div>
            <div class="fg">
              <label> D</label>
              <input v-model="quizModal.meta.options.d[selected_lang]" type="text" class="form-input">
              <input-error :errors="error_bag" field="options_d"/>
            </div>
          </div>


        </div>


        <div class="fg mt-5">
          <label> Correct Answer</label>
          <input v-model="quizModal.meta.correct_answer" type="text" class="form-input">
          <input-error :errors="error_bag" field="correct_answer"/>
        </div>

        <div class="fg mt-5">
          <label> Explanation</label>
          <textarea v-model="quizModal.description[selected_lang]" class="textarea"></textarea>
          <input-error :errors="error_bag" field="explanation"/>
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
import Modal from "../components/Modal.vue";
import {onMounted, ref} from "vue";
import Toggle from "../components/Toggle.vue";
import LangSelect from "../components/LangSelect.vue";
import InputError from "../components/inputError.vue";
import {useConfigStore} from "../stores/ConfigStore.js";
import api from "../Utils/axios.js";
import {cloneObj, validation_errors_process} from "../Utils/helper.js";

const conf = useConfigStore();

const _defaultModal = {
  title: {en: "Question 01"},
  meta: {
    correct_answer: "C",
    options: {
      a: {en: "Answer 1"},
      b: {en: "Answer 2"},
      c: {en: "Answer 3"},
      d: {en: "Answer 4"}
    },
  },
  description: {en: "Explanation 01"},
  published: false
}

const error_bag = ref({});

const quizModal = ref(cloneObj(_defaultModal))
const isOpen = ref(false)
const selected_lang = ref("en")

const quiz_list = ref([]);
const selected_quiz = ref(0);
const openModal = (_id = 0) => {
  if (_id !== 0) {
    selected_quiz.value = _id;
    quizModal.value = quiz_list.value.find(quiz => quiz._id === _id);
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

  if (selected_quiz.value === 0) {

    await api.post('/admin/trivia-quiz', quizModal.value)
        .then(res => {
          console.log(res);
          // closeModal();
        })
        .catch(error => {
          console.log(error.response.data);
          error_bag.value = validation_errors_process(error)
        })

  } else {

    await api.put(`/admin/trivia-quiz/${selected_quiz.value}`, quizModal.value)
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
  await api.delete(`/admin/trivia-quiz/${selected_quiz.value}`)
  await get_quiz();
  closeModal();
}

const get_quiz = async () => {

  const res = await api.get('admin/trivia-quiz')
  console.log(res.data)
  quiz_list.value = res.data

}


onMounted(async () => {
  await get_quiz();
})

</script>

<style lang="scss" scoped>

</style>