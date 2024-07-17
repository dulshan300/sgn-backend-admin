import PusherJS from 'pusher-js'

PusherJS.logToConsole = true;

let pusher = new PusherJS( import.meta.env.VITE_PUSHER_APP_KEY, {
    wsHost: import.meta.env.VITE_PUSHER_HOST,
    wsPort: import.meta.env.VITE_PUSHER_PORT,
    forceTLS: false,
    encrypted: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
});

export default pusher

