import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StudentDashboard() {
  return (
    <DashboardLayout title="Student Dashboard" role="STUDENT">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome, Student
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            View your results, attendance, and school announcements.
          </p>

          {/* Quick Actions */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/student/attendance">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-6 text-lg h-auto">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View My Attendance
              </Button>
            </Link>
            <Link href="/student/results">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-6 text-lg h-auto">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View My Results
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-card p-6 shadow-md border border-border">
              <div className="text-3xl font-bold text-foreground">0%</div>
              <div className="mt-1 text-sm text-muted-foreground">Attendance Rate</div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-md border border-border">
              <div className="text-3xl font-bold text-foreground">0</div>
              <div className="mt-1 text-sm text-muted-foreground">Exams Taken</div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-md border border-border">
              <div className="text-3xl font-bold text-foreground">0</div>
              <div className="mt-1 text-sm text-muted-foreground">Pending Fees</div>
            </div>
          </div>

          <div className="mt-12 rounded-lg bg-card p-8 shadow-md border border-border text-left">
            <h2 className="text-xl font-semibold text-foreground">🎉 Authentication Active!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You are now logged in as a student. The authentication system is working!
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>✅ JWT-based authentication</li>
              <li>✅ Role-based access control (RBAC)</li>
              <li>✅ HTTP-only secure cookies</li>
              <li>✅ Protected routes via middleware</li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              🚧 Additional features coming in future phases.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
