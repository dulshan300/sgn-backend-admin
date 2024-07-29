import { RiDashboard2Line, RiSettings2Line, RiWindowFill } from "@remixicon/vue";

// {
//     path: '/',
//     name: 'home',
//     meta: {title: "Dashboard", icon: RiDashboard2Line},
//     component: () => import('../pages/Home.vue')
// },

export default [
    {
        path: '/',
        name: 'settings',
        meta: { title: "Settings", icon: RiSettings2Line },
        component: () => import('../pages/Settings.vue')
    },

    {
        path: '/chat-approval',
        name: 'chat-approval',
        meta: { title: "Chat Approval", icon: RiWindowFill },
        component: () => import('../pages/ChatApproval.vue')
    }, {
        path: '/message-approval',
        name: 'message-approval',
        meta: { title: "Message Approval", icon: RiWindowFill },
        component: () => import('../pages/MessageApproval.vue')
    },
    {
        path: '/roof-top-settings',
        name: 'roof-top-settings',
        meta: { title: "Roof Top Settings", icon: RiWindowFill },
        component: () => import('../pages/RoofTop.vue')
    },
    {
        path: '/trivia-quiz',
        name: 'trivia-quiz',
        meta: { title: "Trivia Quiz", icon: RiWindowFill },
        component: () => import('../pages/TriviaQuiz.vue')
    },
    {
        path: '/ice-cream-quiz',
        name: 'ice-cream-quiz',
        meta: { title: "Ice cream Quiz", icon: RiWindowFill },
        component: () => import('../pages/IceCreamQuiz.vue')
    },
    {
        path: '/cook',
        name: 'cook',
        meta: { title: "Cook Like Mak", icon: RiWindowFill },
        component: () => import('../pages/cook.vue')
    },
    {
        path: '/cook/:id/videos',
        name: 'cooking-videos',
        meta: { title: "Cook Like Mak | Videos", icon: RiWindowFill },
        component: () => import('../pages/cook-videos.vue'),
        sub: true
    }, {
        path: '/cook/:id/recipes',
        name: 'cooking-recipes',
        meta: { title: "Cook Like Mak | Recipes", icon: RiWindowFill },
        component: () => import('../pages/cook-recipes.vue'),
        sub: true
    },
    {
        path: '/colouring',
        name: 'colouring',
        meta: { title: "Colouring", icon: RiWindowFill },
        component: () => import('../pages/Colouring.vue')
    },
    {
        path: '/scary-story',
        name: 'Scary Story',
        meta: { title: "Scary Story", icon: RiWindowFill },
        component: () => import('../pages/ScaryStory.vue')
    },

    {
        path: '/mama-shop',
        name: 'mama-shop',
        meta: { title: "Mama shop", icon: RiWindowFill },
        component: () => import('../pages/MamaShop.vue')
    }, {
        path: '/fitness-corner',
        name: 'fitness-corner',
        meta: { title: "Fitness Corner", icon: RiWindowFill },
        component: () => import('../pages/FitnessCorner.vue')
    },



]