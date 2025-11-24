import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamForm } from './ExamForm';
import { ExamList } from './ExamList';

export default async function ExamsPage() {
  const [exams, classes] = await Promise.all([
    prisma.exam.findMany({
      include: {
        class: true,
        subjects: {
          include: {
            subject: true,
          },
        },
        _count: {
          select: {
            results: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    }),
    prisma.class.findMany({
      orderBy: { order: 'asc' },
    }),
  ]);

  return (
    <DashboardLayout title="Exams Management" role="ADMIN">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Exams</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Create and manage exams for different classes
              </p>
            </div>
            <ExamForm classes={classes} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Exams</CardTitle>
            <CardDescription>
              {exams.length} {exams.length === 1 ? 'exam' : 'exams'} scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExamList exams={exams} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
