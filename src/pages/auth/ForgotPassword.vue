<template>
    <div>
        <div class="text-center">
            <h1 class="my-3 text-3xl font-semibold text-gray-700">Fogot Password ?</h1>
            <div class="flex justify-center mb-8 items-center">
                <p class="text-gray-500">Enter you email to get reset link or  </p>
                <router-link :to="{ name: 'login' }"
                    class=" text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500">&nbsp; Sign
                    In</router-link>
            </div>
        </div>
        <div class="m-7">
            <form action="">
                <div class="mb-6">
                    <label for="email" class="block mb-2 text-sm text-gray-600">Email Address</label>
                    <input type="email" name="email" id="email" placeholder="you@company.com"
                        class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
                </div>



                <div class="mb-6">
                    <button type="button"
                        class="w-full px-3 py-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none">Get
                        Reset Link</button>
                </div>

                <!-- <p class="text-sm text-center text-gray-400">Don't have an account yet? <a href="#!"
                        class="text-indigo-400 focus:outline-none focus:underline focus:text-indigo-500">Sign
                        up</a>.</p> -->
            </form>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>
