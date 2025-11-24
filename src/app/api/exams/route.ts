import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/exams - Get all exams (with optional class filter)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const classId = searchParams.get('classId');

    const where = classId ? { classId } : {};

    const exams = await prisma.exam.findMany({
      where,
      include: {
        class: true,
        subjects: {
          include: {
            subject: true,
          },
        },
        _count: {
          select: {
            results: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return NextResponse.json({ success: true, exams });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}

// POST /api/exams - Create a new exam (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can create exams.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, term, classId, startDate, endDate } = body;

    // Validation
    if (!name || !classId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, classId, startDate, endDate' },
        { status: 400 }
      );
    }

    // Verify class exists
    const classExists = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classExists) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Create exam
    const exam = await prisma.exam.create({
      data: {
        name,
        term: term || null,
        classId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
      include: {
        class: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Exam created successfully',
      exam,
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
  }
}
