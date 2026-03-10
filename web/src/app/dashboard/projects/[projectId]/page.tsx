"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import api from "@/lib/api";
import { Task } from "@/types";

import {
  joinProjectRoom,
  leaveProjectRoom,
  onSocketEvent,
  offSocketEvent,
} from "@/lib/socket";

import { useAuth } from "@/context/AuthContext";

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!user) return;

    joinProjectRoom(projectId, user._id);

    return () => {
      leaveProjectRoom(projectId, user._id);
    };
  }, [projectId, user]);

  useEffect(() => {
    const handleTaskCreated = (task: Task) => {
      if (task.projectId !== projectId) return;

      setTasks((prev) => [task, ...prev]);
    };

    onSocketEvent("taskCreated", handleTaskCreated);

    return () => {
      offSocketEvent("taskCreated", handleTaskCreated);
    };
  }, [projectId]);

  useEffect(() => {
    const handleTaskUpdated = (task: Task) => {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    };

    onSocketEvent("taskUpdated", handleTaskUpdated);

    return () => {
      offSocketEvent("taskUpdated", handleTaskUpdated);
    };
  }, []);

  useEffect(() => {
    const handleTaskDeleted = (data: any) => {
      setTasks((prev) => prev.filter((t) => t._id !== data.taskId));
    };

    onSocketEvent("taskDeleted", handleTaskDeleted);

    return () => {
      offSocketEvent("taskDeleted", handleTaskDeleted);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Project Dashboard</h1>

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
