"use client";

import { useState, useEffect } from "react";

import api from "@/lib/api";
import { User, Task } from "@/types";
import Loader from "../ui/Loader";

interface Props {
  open: boolean;
  task: Task;
  projectId: string;
  onClose: () => void;
  onTaskUpdate: (task: Task) => void;
}

export default function AssignUserModal({
  open,
  task,
  projectId,
  onClose,
  onTaskUpdate,
}: Props) {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchMembers = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`);
        setMembers(res.data.project.members);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [projectId, open]);

  if (!open) return null;

  const toggleUser = async (userId: string) => {
    try {
      setToggling(userId);

      const res = await api.post(`/tasks/${task._id}/assign`, { userId });

      // Update parent immediately from API response
      // Backend also emits "taskUpdated" for other clients
      onTaskUpdate(res.data.task);
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center animate-fadeIn">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Assign Users</h2>

        {loading && <Loader size="md" />}

        <div className="space-y-2">
          {members.map((user) => {
            const assigned = task.assignees.some((a) => a._id === user._id);

            return (
              <div
                key={user._id}
                className="flex items-center justify-between border p-3 rounded"
              >
                <span>{user.name}</span>

                <button
                  onClick={() => toggleUser(user._id)}
                  disabled={toggling === user._id}
                  className={`px-3 py-1 text-sm rounded ${
                    assigned
                      ? "bg-red-500 text-white"
                      : "bg-blue-600 text-white"
                  } ${toggling === user._id ? "opacity-50" : ""}`}
                >
                  {toggling === user._id
                    ? "..."
                    : assigned
                    ? "Remove"
                    : "Assign"}
                </button>
              </div>
            );
          })}
        </div>

        <button onClick={onClose} className="mt-4 text-sm text-gray-500">
          Close
        </button>
      </div>
    </div>
  );
}
