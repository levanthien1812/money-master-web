import Pusher from "pusher-js";

const pusher = new Pusher("2a919bb67b1368c7c2ec", {
    cluster: "ap1",
})

export default pusher;