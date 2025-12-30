import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL); // Backend URL in .env

export default socket;
