<template>
  <div>

    <div class="mt-4">
      <div class="flex flex-wrap -mx-6">
        <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
          <div @click="chat_selected_state = 0"
            class="cursor-pointer flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
            <div class="p-3 bg-blue-600 bg-opacity-75 rounded-full">
              <RiInformation2Line class="w-8 h-8 text-white" />
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">{{ chat_status.pending }}</h4>
              <div class="text-gray-500">Pending</div>
            </div>
          </div>
        </div>

        <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
          <div @click="chat_selected_state = 1"
            class="cursor-pointer flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
            <div class="p-3 bg-green-600 bg-opacity-75 rounded-full">
              <RiCheckboxCircleLine class="w-8 h-8 text-white" />
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">{{ chat_status.approved }}</h4>
              <div class="text-gray-500">Approved</div>
            </div>
          </div>
        </div>

        <div class="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
          <div @click="chat_selected_state = 2"
            class="cursor-pointer flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
            <div class="p-3 bg-red-600 bg-opacity-75 rounded-full">
              <RiCloseCircleLine class="w-8 h-8 text-white" />
            </div>

            <div class="mx-5">
              <h4 class="text-2xl font-semibold text-gray-700">{{ chat_status.rejected }}</h4>
              <div class="text-gray-500">Rejected</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8">

    </div>

    <div class="flex flex-col mt-8">
      <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">

          <span
            class="flex items-center px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-white uppercase border-b border-gray-200"
            :class="{ 'bg-blue-600': chat_selected_state === 0, 'bg-green-600': chat_selected_state === 1, 'bg-red-600': chat_selected_state === 2 }">
            {{ chat_selected_state === 0 ? 'Pending' : chat_selected_state === 1 ? 'Approved' : 'Rejected' }}
          </span>

          <table class="min-w-full">
            <thead>

              <tr>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  #
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                  Message
                </th>
                <th
                  class="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">

                </th>

              </tr>
            </thead>

            <tbody class="bg-white">
              <template v-for="chat, i in chat_result.data">

                <tr>
                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="flex items-center">
                      <div class="">
                        <div class="text-sm leading-5 text-gray-900">
                          {{ i + 1 }}
                        </div>

                      </div>
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <p class="text-sm leading-5 text-gray-900">{{ chat.content }}</p>
                  </td>

                  <td
                    class="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">

                    <div v-if="chat_selected_state === 0" class="flex gap-5 items-center">
                      <button @click="approved(chat._id)">
                        <RiCheckboxCircleLine class="w-6 h-6 text-green-600" />
                      </button>

                      <button @click="rejected(chat._id)">
                        <RiCloseCircleLine class="w-6 h-6 text-red-600" />
                      </button>
                    </div>

                    <div v-if="chat_selected_state === 1" class="flex gap-5 items-center">

                      <button @click="rejected(chat._id)">
                        <RiCloseCircleLine class="w-6 h-6 text-red-600" />
                      </button>

                      <button @click="_delete(chat._id)">
                        <RiDeleteBin2Line class="w-6 h-6 text-red-600" />
                      </button>
                    </div>

                    <div v-if="chat_selected_state === 2" class="flex gap-5 items-center">

                      <button @click="approved(chat._id)">
                        <RiCheckboxCircleLine class="w-6 h-6 text-green-600" />
                      </button>

                      <button @click="_delete(chat._id)">
                        <RiDeleteBin2Line class="w-6 h-6 text-red-600" />
                      </button>
                    </div>

                  </td>
                </tr>

              </template>


            </tbody>
          </table>


        </div>
        <!--pagination-->
        <div class="">

          <Pagination :result="chat_result" @pagechanged="onPageChange" />

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>

import { RiInformation2Line, RiCheckboxCircleLine, RiCloseCircleLine, RiPencilLine, RiEraserLine, RiDeleteBack2Line, RiDeleteBin2Line } from "@remixicon/vue";
import { onMounted, onUnmounted, ref, watch } from "vue";
import api from "../Utils/axios.js";
import { useConfigStore } from "../stores/ConfigStore.js";
import Pagination from "../components/Pagination.vue";
import { useToast } from "vue-toastification";
import { cloneObj } from "../Utils/helper.js";

const configStore = useConfigStore();
const toast = useToast();

const chat_status = ref({
  pending: 0,
  approved: 0,
  rejected: 0
});

const chat_selected_state = ref(0);

const modal = {
  "total_records": 0,
  "totalPages": 1,
  "currentPage": 1,
  "data": []
};

const chat_result = ref(cloneObj(modal));

watch(chat_selected_state, () => {
  console.log(chat_selected_state.value);

  chat_result.value = cloneObj(modal);

  get_chats();
})

const get_chats_status = async () => {
  try {
    const res = await api.get(`/admin/messages-status`)
    chat_status.value = res.data;
  } catch (e) {
  }
}
const get_chats = async (page = 1) => {
  try {
    const res = await api.get(`/admin/messages/${chat_selected_state.value}?page=${page}`)
    chat_result.value = res.data;
  } catch (e) {
  }
}

const handle_new_pending = async () => {
  await get_chats_status();
  await get_chats();
}

const onPageChange = async (page) => {
  await get_chats(page);
}

onMounted(async () => {

  if (configStore.channel) {
    configStore.channel.bind('new-message-pending', handle_new_pending)
  }

  await handle_new_pending()
})

onUnmounted(() => {

  if (configStore.channel) {
    configStore.channel.unbind('new-message-pending', handle_new_pending)
  }
})


const approved = _id => {

  api.post('/admin/messages-status', {
    id: _id,
    status: 1
  }).then(res => {
    handle_new_pending();
    toast.info('Chat Status Updated')
  }).catch(err => {
  })

}
const rejected = _id => {

  api.post('/admin/messages-status', {
    id: _id,
    status: 2
  }).then(res => {
    handle_new_pending();
    toast.info('Chat Status Updated')
  }).catch(err => {
  })

}

const _delete = _id => {
  let res = confirm("Are you sure you want to delete this chat?");
  if (res) {
    api.delete(`/admin/messages/${_id}`).then(res => {
      handle_new_pending();
      toast.info('Message Deleted')
    }).catch(err => {
    })
  }
}


</script>

<style lang="scss" scoped></style>