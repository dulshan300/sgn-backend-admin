<template>
  <div>
    <div class="text-center">
      <h1 class="my-3 text-3xl font-semibold text-gray-700">Sign in</h1>
      <p class="text-gray-500">Sign in to access your account</p>
    </div>
    <div class="m-7">
      <form @submit.prevent="_login">
        <div class="mb-6">
          <label for="email" class="block mb-2 text-sm text-gray-600">Email Address</label>
          <input v-model="state.email" autocomplete="off" type="email" name="email" id="email"
                 placeholder="you@company.com"
                 class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"/>

          <InputError :errors="error_bag" field="email"/>

        </div>
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <label for="password" class="text-sm text-gray-600">Password</label>
            <router-link :to="{ name: 'forgot-password' }"
                         class="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500">
              Forgot
              password?
            </router-link>
          </div>
          <input v-model="state.password" autocomplete="off" type="password" name="password" id="password"
                 placeholder="Your Password"
                 class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"/>
          <InputError :errors="error_bag" field="password"/>
        </div>
        <div class="mb-6">
          <button :disabled="isProcessing" type="submit" class="btn btn-primary">Sign in</button>
        </div>        
      </form>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';
import InputError from '../../components/inputError.vue';
import useForm from '../../hooks/useForm';
import {useAuthStore} from '../../stores/AuthStore';


const {state, reset, error_bag, submit, isProcessing} = useForm({
  email: '',
  password: '',
})

const authStore = useAuthStore();
const router = useRouter();

const _login = () => {

  submit('auth/login', (data) => {

    authStore.login(data)

    setTimeout(() => {
      router.push({name: 'home'})
    }, 1000)


  }, () => {
    reset()
  });

}


</script>

<style lang="scss" scoped></style>
