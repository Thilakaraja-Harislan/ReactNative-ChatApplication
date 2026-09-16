import { io } from "socket.io-client";

const SOCKET_URL = "http://172.19.52.90:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;