"use client";

import { Task } from "@/types";
import api from "@/lib/api";

interface Props {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

function groupTasks(tasks: Task[]) {
  return {
    todo: tasks.filter((t) => t.status === "todo"),
    inProgress: tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };
}

function TaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", task._id);
  };
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:shadow"
    >
      <h4 className="font-semibold">{task.title}</h4>

      {task.description && (
        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
      )}

      <div className="flex gap-2 mt-3">
        {task.assignees.map((user) => (
          <div key={user._id} className="text-xs bg-gray-200 px-2 py-1 rounded">
            {user.name}
          </div>
        ))}
      </div>
    </div>
  );
}
function Column({
  title,
  status,
  tasks,
  onTaskClick,
}: {
  title: string;
  status: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}) {
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");

    if (!taskId) return;

    await api.patch(`/tasks/${taskId}`, { status });
  };
  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };
  return (
    <div onDrop={handleDrop} onDragOver={allowDrop} className="flex-1">
      <h3 className="font-semibold mb-4">{title}</h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={() => onTaskClick?.(task)}
          />
        ))}
      </div>
    </div>
  );
}

export default function TaskBoard({ tasks, onTaskClick }: Props) {
  const grouped = groupTasks(tasks);

  return (
    <div className="grid grid-cols-3 gap-6">
      <Column
        title="Todo"
        status="todo"
        tasks={grouped.todo}
        onTaskClick={onTaskClick}
      />

      <Column
        title="In Progress"
        status="in-progress"
        tasks={grouped.inProgress}
        onTaskClick={onTaskClick}
      />

      <Column
        title="Done"
        status="done"
        tasks={grouped.done}
        onTaskClick={onTaskClick}
      />
    </div>
  );
}
