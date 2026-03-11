"use client";

import { useEffect, useState } from "react";
import {
  joinProjectRoom,
  leaveProjectRoom,
  onSocketEvent,
  offSocketEvent,
} from "@/lib/socket";

export function usePresence(projectId: string, userId: string | undefined) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!userId || !projectId) return;

    joinProjectRoom(projectId, userId);

    const handlePresenceUpdate = (data: {
      projectId: string;
      users: string[];
    }) => {
      if (data.projectId === projectId) {
        setOnlineUsers(data.users);
      }
    };

    onSocketEvent("presenceUpdate", handlePresenceUpdate);

    return () => {
      leaveProjectRoom(projectId, userId);
      offSocketEvent("presenceUpdate", handlePresenceUpdate);
    };
  }, [projectId, userId]);

  return onlineUsers;
}
