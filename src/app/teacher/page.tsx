import DashboardLayout from '@/components/DashboardLayout';

export default function TeacherDashboard() {
  return (
    <DashboardLayout title="Teacher Dashboard" role="TEACHER">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
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
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Welcome, Teacher
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Manage your classes, attendance, and student grades.
          </p>

          {/* Quick Stats */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="text-3xl font-bold text-slate-900">0</div>
              <div className="mt-1 text-sm text-slate-600">My Classes</div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="text-3xl font-bold text-slate-900">0</div>
              <div className="mt-1 text-sm text-slate-600">My Students</div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-md">
              <div className="text-3xl font-bold text-slate-900">0</div>
              <div className="mt-1 text-sm text-slate-600">Pending Tasks</div>
            </div>
          </div>

          <div className="mt-12 rounded-lg bg-white p-8 shadow-md text-left">
            <h2 className="text-xl font-semibold text-slate-900">🎉 Authentication Active!</h2>
            <p className="mt-2 text-sm text-slate-600">
              You are now logged in as a teacher. The authentication system is working!
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>✅ JWT-based authentication</li>
              <li>✅ Role-based access control (RBAC)</li>
              <li>✅ HTTP-only secure cookies</li>
              <li>✅ Protected routes via middleware</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              🚧 Additional features coming in future phases.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
