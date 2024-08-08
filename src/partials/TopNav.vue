<template>
    <header class="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
        <div class="flex items-center">
            <button @click="$emit('sidebarOpen', true)" type="button"
                class="text-gray-500 focus:outline-none lg:hidden">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </svg>
            </button>

        </div>

        <div class="flex items-center">
            <div class="relative flex gap-2 items-center">
                <span class="font-bold text-indigo-600">Event Completed</span>
                <Toggle v-model:checked="event_completed" />
            </div>

            <div class="relative">
                <button @click="notificationOpen = !notificationOpen"
                    class="flex mx-4 text-gray-600 focus:outline-none">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        </path>
                    </svg>
                </button>

                <div v-if="notificationOpen" @click="notificationOpen = false" class="fixed inset-0 z-10 w-full h-full">
                </div>

                <Transition>
                    <div v-if="notificationOpen"
                        class="absolute right-0 z-10 mt-2 overflow-hidden bg-white rounded-lg shadow-xl w-80"
                        style="width: 20rem;">
                        <a href="#"
                            class="flex items-center px-4 py-3 -mx-2 text-gray-600 hover:text-white hover:bg-indigo-600">
                            <img class="object-cover w-8 h-8 mx-1 rounded-full"
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=334&amp;q=80"
                                alt="avatar">
                            <p class="mx-2 text-sm">
                                <span class="font-bold" href="#">Sara Salah</span> replied on the <span
                                    class="font-bold text-indigo-400" href="#">Upload Image</span> artical .
                                2m
                            </p>
                        </a>
                        <a href="#"
                            class="flex items-center px-4 py-3 -mx-2 text-gray-600 hover:text-white hover:bg-indigo-600">
                            <img class="object-cover w-8 h-8 mx-1 rounded-full"
                                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=634&amp;q=80"
                                alt="avatar">
                            <p class="mx-2 text-sm">
                                <span class="font-bold" href="#">Slick Net</span> start following you . 45m
                            </p>
                        </a>
                        <a href="#"
                            class="flex items-center px-4 py-3 -mx-2 text-gray-600 hover:text-white hover:bg-indigo-600">
                            <img class="object-cover w-8 h-8 mx-1 rounded-full"
                                src="https://images.unsplash.com/photo-1450297350677-623de575f31c?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=334&amp;q=80"
                                alt="avatar">
                            <p class="mx-2 text-sm">
                                <span class="font-bold" href="#">Jane Doe</span> Like Your reply on <span
                                    class="font-bold text-indigo-400" href="#">Test with TDD</span> artical
                                . 1h
                            </p>
                        </a>
                        <a href="#"
                            class="flex items-center px-4 py-3 -mx-2 text-gray-600 hover:text-white hover:bg-indigo-600">
                            <img class="object-cover w-8 h-8 mx-1 rounded-full"
                                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=398&amp;q=80"
                                alt="avatar">
                            <p class="mx-2 text-sm">
                                <span class="font-bold" href="#">Abigail Bennett</span> start following you
                                . 3h
                            </p>
                        </a>
                    </div>
                </Transition>
            </div>

            <div class="relative">
                <button @click="dropdownOpen = !dropdownOpen"
                    class="relative w-8 h-8 overflow-hidden rounded-full border focus:outline-none flex justify-center items-center">
                    <RiUser4Fill class="w-6 h-6 text-indigo-600" />
                </button>

                <div v-if="dropdownOpen" @click="dropdownOpen = false" class="fixed inset-0 z-10 w-full h-full">
                </div>

                <Transition>
                    <div v-if="dropdownOpen"
                        class="absolute right-0 z-10 w-48 mt-2 overflow-hidden bg-white rounded-md shadow-xl">
                        <button @click="show_update_password = true"
                            class="w-full block px-4 py-2 text-sm text-left text-gray-700 hover:bg-indigo-600 hover:text-white">Update
                            Password</button>

                        <button @click="authStore.logout"
                            class="w-full block px-4 py-2 text-sm text-left text-gray-700 hover:bg-indigo-600 hover:text-white">Logout</button>
                    </div>

                </Transition>
            </div>
        </div>

        <Modal title="Update Password" :isOpen="show_update_password" @close="show_update_password = false">

            <form @submit.prevent="handleUpdatePassword" method="post">
                <div class="flex flex-col gap-4">
                    <div class="fg">
                        <label class="label">
                            <span class="label-text">Current password</span>
                        </label>
                        <PasswordInput v-model="update_passwrod_model.current_password" />
                        <InputError :errors="error_bag" field="current_password" />
                    </div>
                    <div class="fg">
                        <label class="label">
                            <span class="label-text">New password</span>
                        </label>
                        <PasswordInput v-model="update_passwrod_model.new_password" />
                        <InputError :errors="error_bag" field="new_password" />
                    </div>
                    <div class="fg">
                        <label class="label">
                            <span class="label-text">Confirm password</span>
                        </label>
                        <PasswordInput v-model="update_passwrod_model.confirm_password" />
                        <InputError :errors="error_bag" field="confirm_password" />
                    </div>
                </div>

                <div class="mt-10">
                    <button class="btn btn-primary" @click="updatePassword">Update Password</button>
                </div>
            </form>

        </Modal>
    </header>
</template>

<script setup>

import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useAuthStore } from '../stores/AuthStore';
import Toggle from '../components/Toggle.vue';
import api from '../Utils/axios';
import Modal from '../components/Modal.vue';
import InputError from '../components/inputError.vue';
import PasswordInput from '../components/PasswordInput.vue';
import { validation_errors_process } from '../Utils/helper';
import { useToast } from 'vue-toastification';
import { RiUser4Fill } from '@remixicon/vue';

const notificationOpen = ref(false)
const dropdownOpen = ref(false)

const error_bag = ref({});

const update_passwrod_model = ref({
    current_password: '',
    new_password: '',
    confirm_password: ''
})

const emit = defineEmits(['sidebarOpen'])
const authStore = useAuthStore();
const toast = useToast();

const event_completed = ref(false)

const show_update_password = ref(true)

const handleUpdatePassword = async () => {
    error_bag.value = {}
    try {
        const res = await api.post('/auth/update-password', update_passwrod_model.value)

        if (res.status === 200) {
            toast.success(res.data.message)
            show_update_password.value = false
            update_passwrod_model.value = {
                current_password: '',
                new_password: '',
                confirm_password: ''
            }
            // show_update_password.value = false
        }


    } catch (error) {
        error_bag.value = validation_errors_process(error)
    }
}

onBeforeMount(() => {
    const data = {
        settings: ['event_completed']
    }

    api.post('/admin/settings', data)
        .then(res => {

            // console.log(res);
            if (res.data.event_completed) {
                console.log(res.data.event_completed);
                event_completed.value = true
            }
        })

})


watch(event_completed, () => {
    // send settings to backend
    // console.log(event_completed.value);
    api.put('/admin/settings', {
        settings: [
            { event_completed: event_completed.value }
        ]
    })
})

</script>

<style lang="scss" scoped></style>