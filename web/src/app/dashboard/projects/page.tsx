"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import { Project } from "@/types";

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");

        setProjects(res.data.projects);
      } catch (error) {
        console.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-center">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>

        <button
          onClick={() => router.push("/dashboard/projects/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Project
        </button>
      </div>

      {projects.length === 0 && (
        <p className="text-gray-500">No projects yet</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => router.push(`/dashboard/projects/${project._id}`)}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>

            <p className="text-gray-500 text-sm">
              {project.description || "No description"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
