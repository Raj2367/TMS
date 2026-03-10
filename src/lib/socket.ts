import { Server } from "socket.io";

let io: Server | null = null;

export function initSocket(server: any) {
  if (io) return io;

  io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinProject", (projectId: string) => {
      const room = `project:${projectId}`;
      socket.join(room);

      console.log(`Socket ${socket.id} joined ${room}`);
    });

    socket.on("leaveProject", (projectId: string) => {
      const room = `project:${projectId}`;
      socket.leave(room);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket not initialized");
  }

  return io;
}
