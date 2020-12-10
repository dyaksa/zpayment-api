const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "1118745",
    key: "ed92f14f09ab5705d8cd",
    secret: "7a0740201df6a495b5a4",
    cluster: "ap1",
    useTLS: true
})

module.exports = pusher;
