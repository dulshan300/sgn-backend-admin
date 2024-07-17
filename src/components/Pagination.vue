<template>
  <div v-if="result.totalPages > 1" class="mt-5 flex justify-center">

    <ul class="inline-flex px-2 py-2 gap-3">

      <li v-for="page in result.totalPages" :key="page">
        <button @click="emit('pagechanged', page)"
                class="cursor-pointer flex  items-center justify-center w-8 h-8  rounded  text-white"
                :class="{ 'bg-indigo-600': page === result.currentPage, 'bg-indigo-400': page !== result.currentPage }"
        >
          {{ page }}
        </button>
      </li>
    </ul>


  </div>
</template>

<script setup>

const props = defineProps({
  result: {
    type: Object,
    default: {
      "total_records": 0,
      "totalPages": 1,
      "currentPage": 1,
      "data": []
    }
  }
})

const emit = defineEmits(['pagechanged'])

</script>

<style lang="scss" scoped>


</style>