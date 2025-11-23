import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeacherList } from './TeacherList';

export default async function TeachersPage() {
  const teachers = await prisma.teacher.findMany({
    include: {
      user: {
        select: {
          email: true,
          status: true,
        },
      },
      _count: {
        select: {
          subjects: true,
          classTeacher: true,
        },
      },
    },
    orderBy: {
      firstName: 'asc',
    },
  });

  return (
    <DashboardLayout title="Teachers Management" role="ADMIN">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Teachers</h1>
              <p className="mt-2 text-sm text-slate-600">
                View and manage teacher records
              </p>
            </div>
            {/* Future: Add Teacher button will go here */}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teacher List</CardTitle>
            <CardDescription>
              {teachers.length} {teachers.length === 1 ? 'teacher' : 'teachers'} registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeacherList teachers={teachers} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
