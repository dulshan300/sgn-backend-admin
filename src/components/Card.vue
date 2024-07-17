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
      <span v-if="title.length>0" class="card-title">
        {{ title }}
      </span>

    <div class="card-body mt-5">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">


</style>