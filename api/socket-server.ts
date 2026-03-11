import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS || "*",
    methods: ["GET", "POST"],
  },
});

// projectId -> Set of userIds
const projectPresence = new Map<string, Set<string>>();

// socketId -> { projectId, userId } for disconnect cleanup
const socketUserMap = new Map<string, { projectId: string; userId: string }>();

function emitPresence(projectId: string) {
  const users = Array.from(projectPresence.get(projectId) || []);
  io.to(`project:${projectId}`).emit("presenceUpdate", {
    projectId,
    users,
  });
}

io.on("connection", (socket: Socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("joinProject", ({ projectId, userId }) => {
    if (!projectId || !userId) return;

    // If this socket was already in another room, clean up first
    const prev = socketUserMap.get(socket.id);
    if (prev) {
      socket.leave(`project:${prev.projectId}`);
      projectPresence.get(prev.projectId)?.delete(prev.userId);
      emitPresence(prev.projectId);
    }

    const room = `project:${projectId}`;
    socket.join(room);

    if (!projectPresence.has(projectId)) {
      projectPresence.set(projectId, new Set());
    }
    projectPresence.get(projectId)!.add(userId);

    // Track this socket for disconnect cleanup
    socketUserMap.set(socket.id, { projectId, userId });

    console.log(
      `📍 User ${userId} joined project ${projectId}. Active:`,
      Array.from(projectPresence.get(projectId)!)
    );

    emitPresence(projectId);
  });

  socket.on("leaveProject", ({ projectId, userId }) => {
    if (!projectId || !userId) return;

    const room = `project:${projectId}`;
    socket.leave(room);

    projectPresence.get(projectId)?.delete(userId);
    socketUserMap.delete(socket.id);

    console.log(
      `📍 User ${userId} left project ${projectId}. Active:`,
      Array.from(projectPresence.get(projectId) || [])
    );

    emitPresence(projectId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    // This is the critical part — clean up presence on unexpected disconnect
    const info = socketUserMap.get(socket.id);
    if (info) {
      projectPresence.get(info.projectId)?.delete(info.userId);
      socketUserMap.delete(socket.id);

      console.log(
        `📍 User ${info.userId} dropped from project ${info.projectId}. Active:`,
        Array.from(projectPresence.get(info.projectId) || [])
      );

      emitPresence(info.projectId);
    }
  });
});

const port = parseInt(process.env.SOCKET_PORT || "3002");
httpServer.listen(port, () => {
  console.log(`🔌 Socket.io server running on port ${port}`);
});
