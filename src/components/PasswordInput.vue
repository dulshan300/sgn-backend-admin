<template>
    <div class="flex items-center">
        <input v-model="modal" :type="show_password ? 'text' : 'password'" class="form-input">
        <div class="absolute right-10">
            <RiEyeLine v-if="show_password" class="cursor-pointer text-gray-400" @click="show_password = false" />
            <RiEyeOffLine v-else class="cursor-pointer text-gray-400" @click="show_password = true" />
        </div>
    </div>
</template>

<script setup>

import { RiEyeLine, RiEyeOffLine } from "@remixicon/vue";
import { ref } from "vue";

const show_password = ref(false);

const modal = defineModel();

</script>

<style lang="scss" scoped></style>