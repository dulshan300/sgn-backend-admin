<template>
  <span v-if="error" class="text-red-500 text-xs">{{ error }}</span>
</template>

<script setup>
import {computed} from 'vue';


const props = defineProps({
  errors: {
    type: Object,
    default: {}
  },
  field: {
    type: String,
    default: ''
  }
})

const error = computed(() => {
  return props.errors[props.field]
})

</script>

<style lang="scss" scoped>

</style>