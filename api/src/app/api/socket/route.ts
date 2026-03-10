import { NextRequest } from "next/server";
import { initSocket } from "@/lib/socket";

export async function GET(req: NextRequest) {

  const res: any = (req as any).res;

  if (!res.socket.server.io) {

    console.log("Initializing Socket.io");

    const io = initSocket(res.socket.server);

    res.socket.server.io = io;

  }

  return new Response("Socket server running");
}