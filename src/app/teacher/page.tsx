import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome, Teacher
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Manage your classes, attendance, and student grades.
          </p>

          {/* Quick Actions */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/teacher/attendance">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-6 text-lg h-auto">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Mark Attendance
              </Button>
            </Link>
            <Link href="/teacher/exams">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-6 text-lg h-auto">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Enter Exam Results
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-card p-6 shadow-md border border-border">
              <div className="text-3xl font-bold text-foreground">0</div>
              <div className="mt-1 text-sm text-muted-foreground">My Classes</div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-md border border-border">
              <div className="text-3xl font-bold text-foreground">0</div>
              <div className="mt-1 text-sm text-muted-foreground">My Students</div>
            </div>
            <div className="rounded-xl bg-card p-6 shadow-md border border-border">
              <div className="text-3xl font-bold text-foreground">0</div>
              <div className="mt-1 text-sm text-muted-foreground">Pending Tasks</div>
            </div>
          </div>

          <div className="mt-12 rounded-lg bg-card p-8 shadow-md border border-border text-left">
            <h2 className="text-xl font-semibold text-foreground">🎉 Authentication Active!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You are now logged in as a teacher. The authentication system is working!
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
