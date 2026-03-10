"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      path: "/api/socket",
      transports: ["websocket"],
    });
  }

  return socket;
}

export function joinProjectRoom(projectId: string, userId: string) {
  const socket = getSocket();

  socket.emit("joinProject", {
    projectId,
    userId,
  });
}

export function leaveProjectRoom(projectId: string, userId: string) {
  const socket = getSocket();

  socket.emit("leaveProject", {
    projectId,
    userId,
  });
}

export function onSocketEvent(
  event: string,
  callback: (...args: any[]) => void
) {
  const socket = getSocket();

  socket.on(event, callback);
}

export function offSocketEvent(
  event: string,
  callback?: (...args: any[]) => void
) {
  const socket = getSocket();

  socket.off(event, callback);
}
