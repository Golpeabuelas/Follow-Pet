import { io } from "socket.io-client";
import { API_URL } from "./consts";

export const socket = io(API_URL, {
    transports: ["websocket"],
    autoConnect: false,
});
