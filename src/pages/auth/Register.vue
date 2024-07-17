<template>
    <div>
        <div class="text-center">
            <h1 class="my-3 text-3xl font-semibold text-gray-700">Sign Up</h1>
            <p class="text-gray-500">Let's get started</p>
        </div>
        <div class="m-7">
            <form @submit.prevent="register">
                <div class="mb-6">
                    <label for="name" class="block mb-2 text-sm text-gray-600">Name</label>
                    <input v-model="state.name" autocomplete="off" type="text" name="name" id="name"
                        placeholder="you@company.com"
                        class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />

                    <InputError :errors="error_bag" field="name" />

                </div>
                <div class="mb-6">
                    <label for="email" class="block mb-2 text-sm text-gray-600">Email Address</label>
                    <input v-model="state.email" autocomplete="off" type="email" name="email" id="email"
                        placeholder="you@company.com"
                        class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />

                    <InputError :errors="error_bag" field="email" />

                </div>
                <div class="mb-6">
                    <div class="flex justify-between mb-2">
                        <label for="password" class="text-sm text-gray-600">Password</label>

                    </div>
                    <input v-model="state.password" autocomplete="off" type="password" name="password" id="password"
                        placeholder="Your Password"
                        class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
                    <InputError :errors="error_bag" field="password" />
                </div>
                <div class="mb-6">
                    <button :disabled="isProcessing" type="submit" class="btn btn-primary">Register</button>
                </div>

                <p class="text-sm text-center text-gray-400">Already have an account yet? <router-link
                        :to="{ name: 'login' }"
                        class="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500">Sign
                        in</router-link>.</p>
            </form>
        </div>
    </div>
</template>

<script setup>
import InputError from '../../components/inputError.vue';
import useForm from '../../hooks/useForm';


const { state, reset, error_bag, submit, isProcessing } = useForm({
    name: '',
    email: '',
    password: '',
})



const register = () => {

    submit('auth/register', () => { }, () => { reset() });

}



</script>

<style lang="scss" scoped></style>
