"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import { Task } from "@/types";

export default function SearchPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await api.get(`/search?q=${query}`);

        setResults(res.data.tasks);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const openTask = (task: Task) => {
    router.push(`/dashboard/projects/${task.projectId}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search Tasks</h1>

      <input
        type="text"
        placeholder="Search tasks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border p-3 rounded mb-6"
      />

      {loading && <p className="text-sm text-gray-500">Searching...</p>}

      <div className="space-y-4">
        {results.length === 0 && query && !loading && (
          <p className="text-sm text-gray-500">No results found</p>
        )}

        {results.map((task) => (
          <div
            key={task._id}
            onClick={() => openTask(task)}
            className="bg-white p-4 border rounded cursor-pointer hover:shadow"
          >
            <h3 className="font-semibold">{task.title}</h3>

            {task.description && (
              <p className="text-sm text-gray-500">{task.description}</p>
            )}

            <p className="text-xs text-gray-400 mt-2">Status: {task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
