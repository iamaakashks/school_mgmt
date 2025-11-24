import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// POST /api/exams/[examId]/subjects - Attach subjects to exam (Admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can manage exam subjects.' },
        { status: 403 }
      );
    }

    const { examId } = await params;
    const body = await request.json();
    const { subjects } = body; // Array of { subjectId, maxMarks }

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid subjects array' },
        { status: 400 }
      );
    }

    // Verify exam exists
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Validate all subjects exist
    const subjectIds = subjects.map((s: any) => s.subjectId);
    const validSubjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
    });

    if (validSubjects.length !== subjectIds.length) {
      return NextResponse.json(
        { error: 'One or more subjects not found' },
        { status: 400 }
      );
    }

    // Create exam subjects using transaction
    const examSubjects = await prisma.$transaction(
      subjects.map((subject: { subjectId: string; maxMarks: number }) =>
        prisma.examSubject.upsert({
          where: {
            examId_subjectId: {
              examId,
              subjectId: subject.subjectId,
            },
          },
          update: {
            maxMarks: subject.maxMarks,
          },
          create: {
            examId,
            subjectId: subject.subjectId,
            maxMarks: subject.maxMarks,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `${examSubjects.length} subjects attached to exam`,
      examSubjects,
    });
  } catch (error) {
    console.error('Error attaching subjects to exam:', error);
    return NextResponse.json(
      { error: 'Failed to attach subjects' },
      { status: 500 }
    );
  }
}

// GET /api/exams/[examId]/subjects - Get subjects for an exam
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

    const examSubjects = await prisma.examSubject.findMany({
      where: { examId },
      include: {
        subject: true,
      },
    });

    return NextResponse.json({ success: true, examSubjects });
  } catch (error) {
    console.error('Error fetching exam subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam subjects' },
      { status: 500 }
    );
  }
}
