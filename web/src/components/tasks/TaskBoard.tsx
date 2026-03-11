"use client";

import { Task } from "@/types";

interface Props {
  tasks: Task[];
}

function groupTasks(tasks: Task[]) {
  return {
    todo: tasks.filter((t) => t.status === "todo"),
    inProgress: tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };
}

function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
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

function Column({ title, tasks }: { title: string; tasks: Task[] }) {
  return (
    <div className="flex-1">
      <h3 className="font-semibold mb-4">{title}</h3>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default function TaskBoard({ tasks }: Props) {
  const grouped = groupTasks(tasks);

  return (
    <div className="grid grid-cols-3 gap-6">
      <Column title="Todo" tasks={grouped.todo} />

      <Column title="In Progress" tasks={grouped.inProgress} />

      <Column title="Done" tasks={grouped.done} />
    </div>
  );
}
