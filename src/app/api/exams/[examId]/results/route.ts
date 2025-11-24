import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// POST /api/exams/[examId]/results - Enter/update exam results (Teacher only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Unauthorized. Only teachers can enter results.' },
        { status: 403 }
      );
    }

    const { examId } = await params;
    const body = await request.json();
    const { records } = body; // Array of { studentId, subjectId, marks, grade? }

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid records array' },
        { status: 400 }
      );
    }

    // Verify exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        subjects: true,
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Validate all students and subjects exist
    const studentIds = [...new Set(records.map((r: any) => r.studentId))];
    const subjectIds = [...new Set(records.map((r: any) => r.subjectId))];

    const [students, subjects] = await Promise.all([
      prisma.student.findMany({
        where: { id: { in: studentIds } },
      }),
      prisma.subject.findMany({
        where: { id: { in: subjectIds } },
      }),
    ]);

    if (students.length !== studentIds.length) {
      return NextResponse.json(
        { error: 'One or more students not found' },
        { status: 400 }
      );
    }

    if (subjects.length !== subjectIds.length) {
      return NextResponse.json(
        { error: 'One or more subjects not found' },
        { status: 400 }
      );
    }

    // Create/update exam results using transaction
    const results = await prisma.$transaction(
      records.map((record: { studentId: string; subjectId: string; marks: number; grade?: string }) =>
        prisma.examResult.upsert({
          where: {
            examId_studentId_subjectId: {
              examId,
              studentId: record.studentId,
              subjectId: record.subjectId,
            },
          },
          update: {
            marks: record.marks,
            grade: record.grade || null,
          },
          create: {
            examId,
            studentId: record.studentId,
            subjectId: record.subjectId,
            marks: record.marks,
            grade: record.grade || null,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Results saved for ${results.length} entries`,
      resultsCount: results.length,
    });
  } catch (error) {
    console.error('Error saving exam results:', error);
    return NextResponse.json({ error: 'Failed to save results' }, { status: 500 });
  }
}
