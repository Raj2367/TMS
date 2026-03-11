"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import api from "@/lib/api";
import { Task } from "@/types";
import { onSocketEvent, offSocketEvent } from "@/lib/socket";
import { usePresence } from "@/hooks/usePresence";
import { useAuth } from "@/context/AuthContext";
import TaskBoard from "@/components/tasks/TaskBoard";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import TaskDetails from "@/components/tasks/TaskDetails";

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Presence — gives you an array of online user IDs
  const onlineUsers = usePresence(projectId, user?.name);

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Projects Dashboard</h1>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Task
        </button>
      </div>

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

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet</p>
      ) : (
        <TaskBoard
          tasks={tasks}
          onTaskClick={(task) => setSelectedTask(task)}
        />
      )}

      {/* {selectedTask && ( */}
      <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} />
      {/* )} */}

      <CreateTaskModal
        open={showCreate}
        projectId={projectId}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}
