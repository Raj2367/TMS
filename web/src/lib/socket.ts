"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Track current room so we can rejoin on reconnect
let currentRoom: { projectId: string; userId: string } | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3002", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);

      // Rejoin room after reconnection
      if (currentRoom) {
        console.log("🔄 Rejoining room after reconnect");
        socket?.emit("joinProject", currentRoom);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });
  }

  return socket;
}

export function joinProjectRoom(projectId: string, userId: string) {
  const s = getSocket();

  currentRoom = { projectId, userId };

  if (s.connected) {
    s.emit("joinProject", { projectId, userId });
  } else {
    s.once("connect", () => {
      s.emit("joinProject", { projectId, userId });
    });
  }
}

export function leaveProjectRoom(projectId: string, userId: string) {
  const s = getSocket();
  s.emit("leaveProject", { projectId, userId });
  currentRoom = null;
}

export function onSocketEvent(
  event: string,
  callback: (...args: any[]) => void
) {
  const s = getSocket();
  s.on(event, callback);
}

export function offSocketEvent(
  event: string,
  callback: (...args: any[]) => void
) {
  const s = getSocket();
  s.off(event, callback);
}
