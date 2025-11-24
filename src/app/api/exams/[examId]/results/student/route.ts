import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/exams/[examId]/results/student - Get results for a specific student
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { examId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const requestedStudentId = searchParams.get('studentId');

    let studentId: string;

    // Students can only view their own results
    if (user.role === 'STUDENT') {
      const student = await prisma.student.findUnique({
        where: { userId: user.userId },
        select: { id: true },
      });

      if (!student) {
        return NextResponse.json(
          { error: 'Student profile not found' },
          { status: 404 }
        );
      }

      studentId = student.id;
    } else if (user.role === 'ADMIN' || user.role === 'TEACHER') {
      // Admin/Teacher can view any student's results
      if (!requestedStudentId) {
        return NextResponse.json(
          { error: 'studentId query parameter required for admin/teacher' },
          { status: 400 }
        );
      }
      studentId = requestedStudentId;
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Get student details
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: true,
        section: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get results for this student
    const results = await prisma.examResult.findMany({
      where: {
        examId,
        studentId,
      },
      include: {
        subject: true,
      },
    });

    // Format results
    const subjectResults = exam.subjects.map(examSubject => {
      const result = results.find(r => r.subjectId === examSubject.subjectId);
      return {
        subjectId: examSubject.subjectId,
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

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        admissionNo: student.admissionNo,
        firstName: student.firstName,
        lastName: student.lastName,
        className: student.class?.name || 'Not assigned',
        sectionName: student.section?.name || 'Not assigned',
      },
      exam: {
        id: exam.id,
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
        percentage: parseFloat(percentage.toFixed(2)),
      },
    });
  } catch (error) {
    console.error('Error fetching student results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student results' },
      { status: 500 }
    );
  }
}
