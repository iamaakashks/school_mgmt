import Link from 'next/link';
import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
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
              <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                View and manage teacher records
              </p>
            </div>
            <Link href="/admin/teachers/new">
              <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
                + Add Teacher
              </Button>
            </Link>
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
