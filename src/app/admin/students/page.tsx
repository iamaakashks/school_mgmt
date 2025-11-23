import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentList } from './StudentList';
import { StudentSearch } from './StudentSearch';

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const search = searchParams.search || '';

  const students = await prisma.student.findMany({
    where: search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { admissionNo: { contains: search } },
          ],
        }
      : {},
    include: {
      user: {
        select: {
          email: true,
          status: true,
        },
      },
      class: true,
      section: true,
    },
    orderBy: [
      { firstName: 'asc' },
    ],
    take: 100, // Limit for performance
  });

  return (
    <DashboardLayout title="Students Management" role="ADMIN">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Students</h1>
              <p className="mt-2 text-sm text-slate-600">
                View and manage student records
              </p>
            </div>
            {/* Future: Add Student button will go here */}
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <StudentSearch initialSearch={search} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>
              {students.length} {students.length === 1 ? 'student' : 'students'} found
              {search && ` matching "${search}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentList students={students as any} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
