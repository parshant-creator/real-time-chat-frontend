import { io } from "socket.io-client";

const socket = io(
    "https://real-time-chat-backend-yx6a.onrender.com"
);

export default socket;