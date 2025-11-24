import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN or TEACHER can access this endpoint
    if (user.role !== 'ADMIN' && user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins and teachers can view class attendance.' },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const classId = searchParams.get('classId');
    const sectionId = searchParams.get('sectionId');
    const dateStr = searchParams.get('date');

    if (!classId || !sectionId || !dateStr) {
      return NextResponse.json(
        { error: 'Missing required query parameters: classId, sectionId, date' },
        { status: 400 }
      );
    }

    // Parse date
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    // Get all students in the class/section
    const students = await prisma.student.findMany({
      where: {
        classId: classId,
        sectionId: sectionId,
      },
      select: {
        id: true,
        admissionNo: true,
        firstName: true,
        lastName: true,
        attendance: {
          where: {
            date: date,
          },
          select: {
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' },
      ],
    });

    // Format the response
    const attendanceData = students.map(student => ({
      studentId: student.id,
      admissionNo: student.admissionNo,
      firstName: student.firstName,
      lastName: student.lastName,
      status: student.attendance[0]?.status || null,
      markedAt: student.attendance[0]?.createdAt || null,
    }));

    return NextResponse.json({
      success: true,
      date: date.toISOString().split('T')[0],
      classId,
      sectionId,
      students: attendanceData,
      totalStudents: students.length,
    });
  } catch (error) {
    console.error('Error fetching class attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}
