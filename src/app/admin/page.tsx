export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg">
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Admin Dashboard
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Welcome to the administrative portal. Manage your entire school from here.
          </p>
          <div className="mt-8 rounded-lg bg-white p-8 shadow-md">
            <p className="text-sm text-slate-500">
              🚧 This dashboard is currently under development. Authentication and full features coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
