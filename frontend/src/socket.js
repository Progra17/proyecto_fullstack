import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
    transports: ["websocket", "polling"], // Forzamos tipos de transporte
    autoConnect: true
});

export default socket;