import { defineStore } from "pinia";
import { computed, ref } from "vue";
import pusher from "../Utils/pusher.js";
import { get_settings } from "../Utils/helper.js";

export const useConfigStore = defineStore("config", () => {

    const channel = ref(pusher.subscribe('admin-notifications'));
    const config = ref({});
    const isLoading = ref(false);
    const langs = ref({});

    const setLoading = (val = false) => {
        isLoading.value = val;
    }

    return {
        langs,
        config,
        channel,
        isLoading,
        setLoading
    };
})