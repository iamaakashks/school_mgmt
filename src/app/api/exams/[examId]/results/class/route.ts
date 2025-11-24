import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/exams/[examId]/results/class - Get results for a class (Admin/Teacher)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins and teachers can view class results.' },
        { status: 403 }
      );
    }

    const { examId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const classId = searchParams.get('classId');
    const sectionId = searchParams.get('sectionId');

    if (!classId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: classId' },
        { status: 400 }
      );
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

    // Get students in the class/section
    const studentWhere: any = { classId };
    if (sectionId) {
      studentWhere.sectionId = sectionId;
    }

    const students = await prisma.student.findMany({
      where: studentWhere,
      include: {
        section: true,
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' },
      ],
    });

    // Get results for these students
    const results = await prisma.examResult.findMany({
      where: {
        examId,
        studentId: { in: students.map(s => s.id) },
      },
      include: {
        subject: true,
      },
    });

    // Format results by student
    const studentResults = students.map(student => {
      const studentResultRecords = results.filter(r => r.studentId === student.id);
      
      const subjectResults = exam.subjects.map(examSubject => {
        const result = studentResultRecords.find(r => r.subjectId === examSubject.subjectId);
        return {
          subjectId: examSubject.subjectId,
          subjectName: examSubject.subject.name,
          maxMarks: examSubject.maxMarks,
          marks: result?.marks || null,
          grade: result?.grade || null,
        };
      });

      const totalMaxMarks = exam.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
      const totalMarks = subjectResults.reduce((sum, r) => sum + (r.marks || 0), 0);
      const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;

      return {
        studentId: student.id,
        admissionNo: student.admissionNo,
        firstName: student.firstName,
        lastName: student.lastName,
        sectionName: student.section?.name || null,
        results: subjectResults,
        totalMarks,
        totalMaxMarks,
        percentage: parseFloat(percentage.toFixed(2)),
      };
    });

    return NextResponse.json({
      success: true,
      exam: {
        id: exam.id,
        name: exam.name,
        term: exam.term,
        className: exam.class.name,
        startDate: exam.startDate,
        endDate: exam.endDate,
      },
      students: studentResults,
    });
  } catch (error) {
    console.error('Error fetching class results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch class results' },
      { status: 500 }
    );
  }
}
