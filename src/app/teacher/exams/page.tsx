import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamSelectionForm } from './ExamSelectionForm';

export default async function TeacherExamsPage() {
  // Fetch all exams and classes for the teacher
  const [exams, classes] = await Promise.all([
    prisma.exam.findMany({
      include: {
        class: true,
        subjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    }),
    prisma.class.findMany({
      include: {
        sections: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    }),
  ]);

  return (
    <DashboardLayout title="Exam Management" role="TEACHER">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Enter Exam Results</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Select an exam and class to enter student marks
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mark Entry</CardTitle>
            <CardDescription>
              Choose an exam and class to begin entering marks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExamSelectionForm exams={exams} classes={classes} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
