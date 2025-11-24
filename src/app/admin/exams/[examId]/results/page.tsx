import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassResultsView } from './ClassResultsView';
import { notFound } from 'next/navigation';

export default async function ExamResultsPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      class: {
        include: {
          sections: {
            orderBy: { name: 'asc' },
          },
        },
      },
      subjects: {
        include: {
          subject: true,
        },
      },
    },
  });

  if (!exam) {
    notFound();
  }

  return (
    <DashboardLayout title="Exam Results" role="ADMIN">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Exam Results</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {exam.name} - {exam.class.name} {exam.term && `(${exam.term})`}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>View Results</CardTitle>
            <CardDescription>
              Select a section to view exam results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClassResultsView
              examId={exam.id}
              classId={exam.classId}
              sections={exam.class.sections}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
