export default function HomePage() {
  return (
    <main className="h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Collaborative Task Manager</h1>

        <p className="text-gray-500">Real-time project collaboration</p>

        <div className="space-x-4">
          <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
            Login
          </a>

          <a href="/register" className="px-4 py-2 border rounded">
            Register
          </a>
        </div>
      </div>
    </main>
  );
}
