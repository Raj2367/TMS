"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        {/* Sidebar */}

        <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-8">Task Manager</h2>

          <nav className="flex flex-col gap-4">
            <a href="/dashboard/projects">Projects</a>

            <a href="/dashboard/search">Search</a>
          </nav>

          <button
            onClick={logout}
            className="mt-auto bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        </aside>

        {/* Main content */}

        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
