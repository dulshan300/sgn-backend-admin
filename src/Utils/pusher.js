import PusherJS from 'pusher-js'

PusherJS.logToConsole = true;

let pusher = new PusherJS( import.meta.env.VITE_PUSHER_APP_KEY, {   
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
});

export default pusher

