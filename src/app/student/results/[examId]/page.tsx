import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { getCurrentUser } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { ReportCard } from './ReportCard';

export default async function StudentReportCardPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
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
    notFound();
  }

  // Get exam details
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

  // Get student's results for this exam
  const results = await prisma.examResult.findMany({
    where: {
      examId: examId,
      studentId: student.id,
    },
    include: {
      subject: true,
    },
  });

  // Format results
  const subjectResults = exam.subjects.map((examSubject) => {
    const result = results.find((r) => r.subjectId === examSubject.subjectId);
    return {
      subjectName: examSubject.subject.name,
      subjectCode: examSubject.subject.code,
      maxMarks: examSubject.maxMarks,
      marks: result?.marks || null,
      grade: result?.grade || null,
    };
  });

  const totalMaxMarks = exam.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
  const totalMarks = subjectResults.reduce((sum, r) => sum + (r.marks || 0), 0);
  const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;

  const reportData = {
    student: {
      name: `${student.firstName} ${student.lastName}`,
      admissionNo: student.admissionNo,
      class: student.class?.name || 'Not assigned',
      section: student.section?.name || 'Not assigned',
      dob: student.dob,
    },
    exam: {
      name: exam.name,
      term: exam.term,
      className: exam.class.name,
      startDate: exam.startDate,
      endDate: exam.endDate,
    },
    results: subjectResults,
    summary: {
      totalMarks,
      totalMaxMarks,
      percentage,
    },
  };

  return (
    <DashboardLayout title="Report Card" role="STUDENT">
      <ReportCard data={reportData} />
    </DashboardLayout>
  );
}
