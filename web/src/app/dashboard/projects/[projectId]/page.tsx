"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import api from "@/lib/api";
import { Task } from "@/types";

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/tasks`);

        setTasks(res.data.tasks);
      } catch (error) {
        console.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  if (loading) {
    return <div className="text-center">Loading project...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Project Dashboard</h1>

      {tasks.length === 0 && <p className="text-gray-500">No tasks yet</p>}

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{task.title}</h3>

            <p className="text-sm text-gray-500">{task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
