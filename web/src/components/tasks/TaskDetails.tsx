"use client";

import { Task } from "@/types";
import TaskComments from "./TaskComments";

interface Props {
  task: Task | null;
  onClose: () => void;
}

export default function TaskDetails({ task, onClose }: Props) {
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
          <h3 className="font-semibold mb-2">Assignees</h3>

          <div className="flex gap-2 flex-wrap">
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

        <div>
          <div className="space-y-3">
            <TaskComments task={task} />
          </div>
        </div>
      </div>
    </div>
  );
}
