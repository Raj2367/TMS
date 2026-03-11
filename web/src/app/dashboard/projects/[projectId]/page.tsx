"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import api from "@/lib/api";
import { Task } from "@/types";
import { onSocketEvent, offSocketEvent } from "@/lib/socket";
import { usePresence } from "@/hooks/usePresence";
import { useAuth } from "@/context/AuthContext";

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Presence — gives you an array of online user IDs
  const onlineUsers = usePresence(projectId, user?._id);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/tasks`);
        setTasks(res.data.tasks);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectId]);

  // Real-time task events
  useEffect(() => {
    const handleTaskCreated = (task: Task) => {
      if (task.projectId !== projectId) return;
      setTasks((prev) => [task, ...prev]);
    };

    const handleTaskUpdated = (task: Task) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    };

    const handleTaskDeleted = (data: { taskId: string }) => {
      setTasks((prev) => prev.filter((t) => t._id !== data.taskId));
    };

    onSocketEvent("taskCreated", handleTaskCreated);
    onSocketEvent("taskUpdated", handleTaskUpdated);
    onSocketEvent("taskDeleted", handleTaskDeleted);

    return () => {
      offSocketEvent("taskCreated", handleTaskCreated);
      offSocketEvent("taskUpdated", handleTaskUpdated);
      offSocketEvent("taskDeleted", handleTaskDeleted);
    };
  }, [projectId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Project Dashboard</h1>

      {/* Online presence indicator */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {onlineUsers.length} user{onlineUsers.length !== 1 ? "s" : ""} online
        </span>
        <div className="flex -space-x-2">
          {onlineUsers.map((uid) => (
            <div
              key={uid}
              className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
              title={uid}
            >
              {uid.slice(0, 2).toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {tasks.length === 0 && <p className="text-gray-500">No tasks yet</p>}

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded shadow">
            <h3>{task.title}</h3>
            <p className="text-sm text-gray-500">{task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
