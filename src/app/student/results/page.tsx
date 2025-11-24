import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function StudentResultsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'STUDENT') {
    redirect('/login');
  }

  // Get student profile
  const student = await prisma.student.findUnique({
    where: { userId: user.userId },
    include: {
      class: true,
      section: true,
    },
  });

  if (!student) {
    return (
      <DashboardLayout title="My Results" role="STUDENT">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">
                Student profile not found. Please contact administration.
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Get all exams for student's class
  const exams = await prisma.exam.findMany({
    where: {
      classId: student.classId || undefined,
    },
    include: {
      class: true,
      subjects: {
        include: {
          subject: true,
        },
      },
      results: {
        where: {
          studentId: student.id,
        },
        include: {
          subject: true,
        },
      },
    },
    orderBy: {
      startDate: 'desc',
    },
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout title="My Results" role="STUDENT">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Exam Results</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View your exam history and performance
          </p>
        </div>

        {/* Student Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold text-foreground">
                  {student.firstName} {student.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admission No</p>
                <p className="font-semibold text-foreground">{student.admissionNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-semibold text-foreground">
                  {student.class?.name || 'Not assigned'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Section</p>
                <p className="font-semibold text-foreground">
                  {student.section?.name || 'Not assigned'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exams List */}
        <Card>
          <CardHeader>
            <CardTitle>Exam History</CardTitle>
            <CardDescription>
              {exams.length} {exams.length === 1 ? 'exam' : 'exams'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exams.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No exams found. Check back later when exams are scheduled.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {exams.map((exam) => {
                  const totalMaxMarks = exam.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
                  const totalMarks = exam.results.reduce((sum, r) => sum + r.marks, 0);
                  const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
                  const hasResults = exam.results.length > 0;

                  return (
                    <div
                      key={exam.id}
                      className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">
                            {exam.name}
                            {exam.term && (
                              <span className="ml-2 text-sm font-normal text-muted-foreground">
                                ({exam.term})
                              </span>
                            )}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {exam.subjects.length} subject(s)
                          </p>

                          {hasResults && (
                            <div className="mt-4 flex items-center gap-6">
                              <div>
                                <p className="text-sm text-muted-foreground">Total Score</p>
                                <p className="text-2xl font-bold text-foreground">
                                  {totalMarks.toFixed(1)} / {totalMaxMarks}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Percentage</p>
                                <p className="text-2xl font-bold text-foreground">
                                  {percentage.toFixed(2)}%
                                </p>
                              </div>
                            </div>
                          )}

                          {!hasResults && (
                            <div className="mt-4">
                              <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1 text-sm text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                                Results not yet published
                              </span>
                            </div>
                          )}
                        </div>

                        {hasResults && (
                          <Link href={`/student/results/${exam.id}`}>
                            <Button
                              variant="outline"
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:from-blue-600 hover:to-indigo-700"
                            >
                              View Report Card
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
