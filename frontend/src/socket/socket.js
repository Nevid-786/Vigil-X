import { io } from 'socket.io-client';

const socketURL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export const socket = io(socketURL, {
  autoConnect: true,
  reconnection: true,
});
