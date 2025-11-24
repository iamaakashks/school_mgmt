import Link from 'next/link';
import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentList } from './StudentList';
import { StudentSearch } from './StudentSearch';

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || '';

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
              <h1 className="text-3xl font-bold text-foreground">Students</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                View and manage student records
              </p>
            </div>
            <Link href="/admin/students/new">
              <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
                + Add Student
              </Button>
            </Link>
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
