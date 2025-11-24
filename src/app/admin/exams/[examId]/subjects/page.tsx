import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubjectManagementForm } from './SubjectManagementForm';
import { notFound } from 'next/navigation';

export default async function ExamSubjectsPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      class: true,
      subjects: {
        include: {
          subject: true,
        },
        orderBy: {
          subject: {
            name: 'asc',
          },
        },
      },
    },
  });

  if (!exam) {
    notFound();
  }

  // Get all subjects for the exam's class
  const availableSubjects = await prisma.subject.findMany({
    where: {
      classId: exam.classId,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <DashboardLayout title="Manage Exam Subjects" role="ADMIN">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Exam Subjects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {exam.name} - {exam.class.name} {exam.term && `(${exam.term})`}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attach Subjects to Exam</CardTitle>
            <CardDescription>
              Select subjects and set maximum marks for this exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubjectManagementForm
              examId={exam.id}
              availableSubjects={availableSubjects}
              currentSubjects={exam.subjects}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
