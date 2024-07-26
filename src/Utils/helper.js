import api from "./axios.js";
import {AxiosError} from "axios";

export const save_settings = async (settings) => {
    await api.put('/admin/settings', {
        settings: settings
    })
}

export const get_settings = async (settings) => {
    const res = await api.post('/admin/settings', {
        settings: settings
    })

    return res.data;
}


export const wss_trigger_event = async (channel, event, data = []) => {
    await api.post('/wss/trigger-event', {
        channel: channel,
        event: event,
        data: data
    })
}

export const validation_errors_process = (er) => {

    const error_bag = {};
    if (er instanceof AxiosError) {
        console.log(er);
        if (er.response?.status === 422) {
            const errors = er.response?.data.errors;

            for (const [key, value] of Object.entries(errors)) {
                error_bag[key] = value[0];
            }


        }
    }

    console.log(error_bag)

    return error_bag;
}

export const limit_text = (text, limit = 50) => {
    if (text.length > limit) {
        return text.substring(0, limit) + '...';
    } else {
        return text;
    }
}

export const cloneObj = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

export const img_src = (img) => {
    return import.meta.env.VITE_API_HOST + img;
}

export const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote'],
  ['link'],
  [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
  [{'script': 'sub'}, {'script': 'super'}],
  [{'indent': '-1'}, {'indent': '+1'}],

  [{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}],
  [{'font': []}],
  [{'align': []}],
  ['clean','html-view']
];