import {createRouter, createWebHistory} from 'vue-router'

import AuthLayout from '../layouts/Auth.vue'
import DashboardLayout from '../layouts/Dashboard.vue'
import {useAuthStore} from '../stores/AuthStore'
import navi from "./navi.js";

const routes = [
    {
        path: '/',
        component: DashboardLayout,
        meta: {requiresAuth: true},
        children: navi
    },
    {
        path: '/auth',
        component: AuthLayout,
        children: [

            {
                path: 'login',
                name: 'login',
                component: () => import('../pages/auth/Login.vue')
            },
            {
                path: 'forgot-password',
                name: 'forgot-password',
                component: () => import('../pages/auth/ForgotPassword.vue')
            },            

        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {

    const {ping} = useAuthStore();

    if (to.meta.requiresAuth) {
        await ping()
    }

    next()
})

export default router


// commented paths
// {
//     path: 'register',
//     name: 'register',
//     component: () => import('../pages/auth/Register.vue')
// }