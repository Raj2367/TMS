"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";
import TaskComments from "./TaskComments";
import AssignUserModal from "./AssignUserModal";
import { onSocketEvent, offSocketEvent } from "@/lib/socket";

interface Props {
  task: Task | null;
  onClose: () => void;
}

export default function TaskDetails({ task: initialTask, onClose }: Props) {
  const [task, setTask] = useState<Task | null>(initialTask);
  const [assignOpen, setAssignOpen] = useState(false);

  // Sync when parent passes a new task
  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  // Listen for real-time updates to THIS task
  useEffect(() => {
    if (!task) return;

    const handleTaskUpdated = (updatedTask: Task) => {
      if (updatedTask._id === task._id) {
        setTask(updatedTask);
      }
    };

    onSocketEvent("taskUpdated", handleTaskUpdated);

    return () => {
      offSocketEvent("taskUpdated", handleTaskUpdated);
    };
  }, [task?._id]);

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end">
      <div className="bg-white w-[400px] h-full p-6 overflow-y-auto">
        <button onClick={onClose} className="text-sm text-gray-500 mb-4">
          Close
        </button>

        <h2 className="text-xl font-bold mb-4">{task.title}</h2>

        {task.description && (
          <p className="text-gray-600 mb-6">{task.description}</p>
        )}

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Status</h3>
          <span className="bg-gray-200 px-2 py-1 rounded text-sm">
            {task.status}
          </span>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Assignees</h3>
            <button
              onClick={() => setAssignOpen(true)}
              className="text-sm text-blue-600 cursor-pointer"
            >
              Manage Assignees
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {task.assignees.length === 0 && (
              <p className="text-sm text-gray-500">No assignees</p>
            )}
            {task.assignees.map((user) => (
              <div
                key={user._id}
                className="bg-gray-200 px-2 py-1 rounded text-sm"
              >
                {user.name}
              </div>
            ))}
          </div>
        </div>

        <TaskComments task={task} />

        <AssignUserModal
          open={assignOpen}
          task={task}
          projectId={task.projectId}
          onClose={() => setAssignOpen(false)}
          onTaskUpdate={(updatedTask) => setTask(updatedTask)}
        />
      </div>
    </div>
  );
}
