import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubjectForm } from './SubjectForm';
import { SubjectList } from './SubjectList';

export default async function SubjectsPage() {
  const [subjects, classes, teachers] = await Promise.all([
    prisma.subject.findMany({
      include: {
        class: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.class.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.teacher.findMany({
      include: {
        user: true,
      },
      orderBy: { firstName: 'asc' },
    }),
  ]);

  return (
    <DashboardLayout title="Subjects Management" role="ADMIN">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Subjects</h1>
              <p className="mt-2 text-sm text-slate-600">
                Manage subjects and teacher assignments
              </p>
            </div>
            <SubjectForm classes={classes} teachers={teachers} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Subjects</CardTitle>
            <CardDescription>
              {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'} registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubjectList subjects={subjects} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
