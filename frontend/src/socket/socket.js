import { io } from 'socket.io-client';

const rawSocketURL = import.meta.env.VITE_SOCKET_URL || window.location.origin;
// Strip trailing slash if present
const socketURL = rawSocketURL.replace(/\/$/, '');

export const socket = io(socketURL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
});
