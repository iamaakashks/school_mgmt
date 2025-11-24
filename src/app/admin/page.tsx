import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function AdminDashboard() {
  // Fetch counts for dashboard stats
  const [studentsCount, teachersCount, classesCount, subjectsCount] = await Promise.all([
    prisma.student.count(),
    prisma.teacher.count(),
    prisma.class.count(),
    prisma.subject.count(),
  ]);

  const quickLinks = [
    {
      title: 'Classes',
      description: 'Manage school classes',
      href: '/admin/classes',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Sections',
      description: 'Manage class sections',
      href: '/admin/sections',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Subjects',
      description: 'Manage subjects',
      href: '/admin/subjects',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Students',
      description: 'View student records',
      href: '/admin/students',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-orange-500 to-red-600',
    },
    {
      title: 'Teachers',
      description: 'View teacher records',
      href: '/admin/teachers',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Attendance',
      description: 'View attendance overview',
      href: '/admin/attendance',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'from-teal-500 to-cyan-600',
    },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" role="ADMIN">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back, Administrator. Here's what's happening today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Students</CardDescription>
              <CardTitle className="text-4xl">{studentsCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Teachers</CardDescription>
              <CardTitle className="text-4xl">{teachersCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Classes</CardDescription>
              <CardTitle className="text-4xl">{classesCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Subjects</CardDescription>
              <CardTitle className="text-4xl">{subjectsCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage core academic entities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:border-accent hover:bg-accent/50 hover:shadow-md transition-all">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${link.color} text-white mb-4 shadow-lg`}>
                      {link.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{link.title}</h3>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
