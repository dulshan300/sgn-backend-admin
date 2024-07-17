import {useLocalStorage} from "@vueuse/core";
import {defineStore} from "pinia";
import api from "../Utils/axios";
import {useRouter} from "vue-router";

export const useAuthStore = defineStore("useAuthStore", () => {

    const authConfig = useLocalStorage("authConfig", {
        token: null,
        user: null
    });

    const router = useRouter();

    const ping = async () => {
        try {

            const res = await api.get("/auth/ping");

        } catch (err) {
            // if error is 401 logout
            if (err.response?.status === 401) {
                logout();
            }
        }


    }

    const login = (data) => {
        authConfig.value = data
    }

    const logout = () => {
        authConfig.value.token = null;
        authConfig.value.user = null;
        router.push({name: "login"});
    }

    return {authConfig, ping, login, logout};

});