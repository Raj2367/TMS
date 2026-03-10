import { Server, Socket } from "socket.io";

let io: Server | null = null;
const projectPresence: Map<string, Set<string>> = new Map();

export function initSocket(server: any) {
  if (io) return io;

  io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinProject", ({ projectId, userId }) => {
      const room = `project:${projectId}`;
      socket.join(room);

      if (!projectPresence.has(projectId)) {
        projectPresence.set(projectId, new Set());
      }
      projectPresence.get(projectId)?.add(userId);

      io?.to(room).emit("presenceUpdate", {
        projectId,
        users: Array.from(projectPresence.get(projectId) || []),
      });
    });

    socket.on("leaveProject", ({ projectId, userId }) => {
      const room = `project:${projectId}`;
      socket.leave(room);

      const users = projectPresence.get(projectId);
      users?.delete(userId);

      io?.to(room).emit("presenceUpdate", {
        projectId,
        users: Array.from(users || []),
      });
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
