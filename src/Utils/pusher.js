import Pusher from 'pusher'

Pusher.logToConsole = true;

let pusher = new Pusher( import.meta.env.VITE_PUSHER_APP_KEY, {   
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
});

export default pusher

