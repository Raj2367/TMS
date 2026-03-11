const NEXT_PUBLIC_SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3002";

export async function emitSocketEvent(room: string, event: string, data: any) {
  try {
    const res = await fetch(`${NEXT_PUBLIC_SOCKET_URL}/emit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room, event, data }),
    });

    if (!res.ok) {
      console.error("Failed to emit socket event:", await res.text());
    }
  } catch (error) {
    console.error("Socket server unreachable:", error);
  }
}
