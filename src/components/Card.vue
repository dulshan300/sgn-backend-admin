<script setup>

defineProps({

  title: {
    type: String,
    default: ''
  }
})

</script>

<template>
  <div class="card w-full">
    <div class="card-body ">
      <span v-if="title.length>0" class="card-title">
        {{ title }}
      </span>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">


</style>