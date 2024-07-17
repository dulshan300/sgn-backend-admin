import axios from "axios";
import {useToast} from "vue-toastification";
import {useAuthStore} from "../stores/AuthStore";
import {useConfigStore} from "../stores/ConfigStore.js";


axios.defaults.withCredentials = true

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,

    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'X-Api-role': 'admin'
    },
});

api.interceptors.request.use(config => {
    const auth = useAuthStore();
    config.headers.Authorization = `Bearer ${auth.authConfig.token}`;

    const configStore = useConfigStore();
    if (!configStore.isLoading) {
        configStore.setLoading(true);
    }

    return config;
})

api.interceptors.response.use(
    response => {
        const configStore = useConfigStore();
        configStore.setLoading(false);

        return response
    },
    error => {

        const configStore = useConfigStore();
        configStore.setLoading(false);

        if (error.response?.status === 429) {
            const toast = useToast();
            toast.error(error.response.data.message)
        }

        return Promise.reject(error)
    },
)

export default api