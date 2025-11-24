import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, School, User, Phone, Mail, GraduationCap, Users, Award, CalendarDays, FileText } from 'lucide-react';
import { AssignGradeDialog } from './AssignGradeDialog';
import { AssignTeacherDialog } from './AssignTeacherDialog';

export default async function SubjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch subject with safe _count that won't fail if examSubjects table doesn't exist yet
  let subject;
  try {
    subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            sections: {
              orderBy: { name: 'asc' },
            },
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            examSubjects: true,
          },
        },
      },
    });
  } catch (error) {
    // Fallback if examSubjects table doesn't exist yet
    console.warn('ExamSubject table not found, fetching subject without exam count');
    subject = await prisma.subject.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            sections: {
              orderBy: { name: 'asc' },
            },
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });
    if (subject) {
      subject = { ...subject, _count: { examSubjects: 0 } } as any;
    }
  }

  if (!subject) {
    notFound();
  }

  // Get students count in the class
  const studentsCount = subject.class
    ? await prisma.student.count({
        where: { classId: subject.class.id },
      })
    : 0;

  // Get exams that use this subject
  let examsUsingSubject: any[] = [];
  try {
    const examSubjects = await prisma.examSubject.findMany({
      where: { subjectId: id },
      include: {
        exam: {
          include: {
            class: true,
          },
        },
      },
      orderBy: {
        exam: {
          startDate: 'desc',
        },
      },
      take: 5, // Show latest 5 exams
    });
    examsUsingSubject = examSubjects.map(es => es.exam);
  } catch (error) {
    // Ignore if exam tables don't exist
    console.warn('Exam tables not found');
  }

  // Get other subjects in same class (related subjects)
  const relatedSubjects = subject.class
    ? await prisma.subject.findMany({
        where: {
          classId: subject.class.id,
          id: { not: id },
        },
        select: {
          id: true,
          name: true,
          code: true,
        },
        take: 5,
      })
    : [];

  // Get all classes for assignment
  const allClasses = await prisma.class.findMany({
    orderBy: { order: 'asc' },
  });

  // Get all teachers for assignment
  const allTeachers = await prisma.teacher.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      qualification: true,
    },
    orderBy: { firstName: 'asc' },
  });

  return (
    <DashboardLayout title={`Subject: ${subject.name}`} role="ADMIN">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/subjects">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Subjects
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">{subject.name}</h1>
                <Badge variant="secondary" className="font-mono text-sm">
                  {subject.code}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  <span>{subject.class?.name || 'No grade assigned'}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{studentsCount} students</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Award className="h-4 w-4 mr-1" />
                  <span>{subject._count.examSubjects} exams</span>
                </div>
              </div>
            </div>
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Subject Code
              </CardDescription>
              <CardTitle className="text-3xl font-mono">{subject.code}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center text-xs">
                <GraduationCap className="h-3 w-3 mr-1" />
                Assigned Grade
              </CardDescription>
              <CardTitle className="text-3xl">{subject.class?.name || 'None'}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center text-xs">
                <Users className="h-3 w-3 mr-1" />
                Total Students
              </CardDescription>
              <CardTitle className="text-3xl">{studentsCount}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center text-xs">
                <Award className="h-3 w-3 mr-1" />
                Exams Conducted
              </CardDescription>
              <CardTitle className="text-3xl">{subject._count.examSubjects}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Class Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <School className="h-5 w-5 text-green-500" />
                <CardTitle>Grade & Class Information</CardTitle>
              </div>
              <CardDescription>Details about the grade where this subject is offered</CardDescription>
            </CardHeader>
            <CardContent>
              {subject.class ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <h3 className="font-semibold text-lg text-foreground mb-3">
                      {subject.class.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block mb-1">Total Sections</span>
                        <span className="font-semibold text-foreground text-xl">
                          {subject.class.sections.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1">Total Students</span>
                        <span className="font-semibold text-foreground text-xl">{studentsCount}</span>
                      </div>
                    </div>
                  </div>

                  {subject.class.sections.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        All Sections in {subject.class.name}:
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {subject.class.sections.map((section) => (
                          <div
                            key={section.id}
                            className="rounded-lg border border-border bg-card px-3 py-2.5 text-center hover:bg-muted/50 transition-colors"
                          >
                            <div className="text-xs text-muted-foreground">Section</div>
                            <div className="text-sm font-semibold text-foreground">{section.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <School className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    This subject is not assigned to any grade yet
                  </p>
                  <AssignGradeDialog
                    subjectId={subject.id}
                    subjectName={subject.name}
                    classes={allClasses}
                    currentClassId={subject.classId}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Teacher Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-cyan-500" />
                <CardTitle>Assigned Teacher</CardTitle>
              </div>
              <CardDescription>Primary teacher responsible for this subject</CardDescription>
            </CardHeader>
            <CardContent>
              {subject.teacher ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <GraduationCap className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xl text-foreground mb-1">
                          {subject.teacher.firstName} {subject.teacher.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {subject.teacher.qualification || 'Qualification not specified'}
                        </p>

                        <div className="space-y-2.5">
                          {subject.teacher.phone && (
                            <div className="flex items-center text-sm bg-background/50 rounded-md px-3 py-2">
                              <Phone className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                              <span className="text-foreground font-medium">{subject.teacher.phone}</span>
                            </div>
                          )}
                          {subject.teacher.user && (
                            <div className="flex items-center text-sm bg-background/50 rounded-md px-3 py-2">
                              <Mail className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                              <span className="text-foreground font-medium truncate">
                                {subject.teacher.user.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    No teacher assigned to this subject
                  </p>
                  <AssignTeacherDialog
                    subjectId={subject.id}
                    subjectName={subject.name}
                    teachers={allTeachers}
                    currentTeacherId={subject.teacherId}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Exams Section */}
        {examsUsingSubject.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-purple-500" />
                    <CardTitle>Recent Exams</CardTitle>
                  </div>
                  <CardDescription>Latest exams that included this subject</CardDescription>
                </div>
                <Badge variant="secondary">{examsUsingSubject.length} exam(s)</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {examsUsingSubject.map((exam) => (
                  <Link key={exam.id} href={`/admin/exams/${exam.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Award className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{exam.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {exam.class.name} • {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {exam.term && (
                        <Badge variant="outline">{exam.term}</Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Subjects */}
        {relatedSubjects.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <CardTitle>Other Subjects in {subject.class?.name}</CardTitle>
              </div>
              <CardDescription>Related subjects taught in the same grade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {relatedSubjects.map((relSub) => (
                  <Link key={relSub.id} href={`/admin/subjects/${relSub.id}`}>
                    <div className="p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-blue-500 transition-all cursor-pointer text-center">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                      </div>
                      <h4 className="font-semibold text-sm text-foreground truncate">{relSub.name}</h4>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{relSub.code}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>More details about this subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Subject ID</p>
                <p className="font-mono text-sm text-foreground">{subject.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="text-sm">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      subject.class && subject.teacher
                        ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'
                    }`}
                  >
                    {subject.class && subject.teacher ? 'Fully Configured' : 'Incomplete Setup'}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
