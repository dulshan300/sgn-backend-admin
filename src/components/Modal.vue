<template>
  <transition name="fade">
    <div
        v-if="isOpen"
        class="fixed inset-0 z-40 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto bg-gray-800 bg-opacity-75"

    >
      <div class="relative max-h-[80vh] overflow-y-auto w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        <button
            class="absolute top-0 right-0 p-2 text-gray-700 hover:text-gray-900"
            @click="closeModal"
        >
          &times;
        </button>
        <h2 v-if="title.length>0" class="text-xl font-bold mb-4">{{ title }}</h2>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
