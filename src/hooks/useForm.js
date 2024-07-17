import { reactive, ref } from "vue";
import api from "../Utils/axios";
import { AxiosError } from "axios";

const useForm = (initialState = {}) => {

    const state = reactive(initialState)

    const reset = () => {
        Object.assign(state, initialState)
    }

    const isProcessing = ref(false);

    const error_bag = ref({});

    const submit = (url, success = () => { }, error = () => { }) => {

        isProcessing.value = true;

        error_bag.value = {};

        api.post(url, state)
            .then(res => {
                success(res.data)
            })
            .catch(err => {
                if (err instanceof AxiosError) {
                    console.log(err);
                    if (err.response?.status === 422) {
                        const errors = err.response?.data.errors;

                        for (const [key, value] of Object.entries(errors)) {
                            error_bag.value[key] = value[0];
                        }


                    }
                }

                error(err)
            })
            .finally(() => isProcessing.value = false)

    }

    return { state, isProcessing, error_bag, submit, reset }
}

export default useForm;