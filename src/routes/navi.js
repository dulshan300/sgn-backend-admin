import {RiDashboard2Line, RiSettings2Line, RiWindowFill} from "@remixicon/vue";

export default [
    {
        path: '/',
        name: 'home',
        meta: {title: "Dashboard", icon: RiDashboard2Line},
        component: () => import('../pages/Home.vue')
    },
    {
        path: '/chat-approval',
        name: 'chat-approval',
        meta: {title: "Chat Approval", icon: RiWindowFill},
        component: () => import('../pages/ChatApproval.vue')
    },
    {
        path: '/roof-top-settings',
        name: 'roof-top-settings',
        meta: {title: "Roof Top Settings", icon: RiWindowFill},
        component: () => import('../pages/RoofTop.vue')
    },
    {
        path: '/trivia-quiz',
        name: 'trivia-quiz',
        meta: {title: "Trivia Quiz", icon: RiWindowFill},
        component: () => import('../pages/TriviaQuiz.vue')
    },
    {
        path: '/ice-cream-quiz',
        name: 'ice-cream-quiz',
        meta: {title: "Ice cream Quiz", icon: RiWindowFill},
        component: () => import('../pages/IceCreamQuiz.vue')
    },
    {
        path: '/colouring',
        name: 'colouring',
        meta: {title: "Colouring", icon: RiWindowFill},
        component: () => import('../pages/Colouring.vue')
    },

     {
        path: '/mama-shop',
        name: 'mama-shop',
        meta: {title: "Mama shop", icon: RiWindowFill},
        component: () => import('../pages/MamaShop.vue')
    }, {
        path: '/fitness-corner',
        name: 'fitness-corner',
        meta: {title: "Fitness Corner", icon: RiWindowFill},
        component: () => import('../pages/FitnessCorner.vue')
    },

    {
        path: '/settings',
        name: 'settings',
        meta: {title: "Settings", icon: RiSettings2Line},
        component: () => import('../pages/Settings.vue')
    },

]