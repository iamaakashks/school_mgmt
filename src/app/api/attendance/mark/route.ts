import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and role
    const user = await getCurrentUser();
    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Unauthorized. Only teachers can mark attendance.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { classId, sectionId, date, records } = body;

    // Validation
    if (!classId || !sectionId || !date || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: classId, sectionId, date, and records array' },
        { status: 400 }
      );
    }

    // Get teacher ID
    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.userId },
      select: { id: true },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher profile not found' },
        { status: 404 }
      );
    }

    // Validate that students belong to the specified class and section
    const studentIds = records.map((r: any) => r.studentId);
    const validStudents = await prisma.student.findMany({
      where: {
        id: { in: studentIds },
        classId: classId,
        sectionId: sectionId,
      },
      select: { id: true },
    });

    const validStudentIds = new Set(validStudents.map(s => s.id));
    const invalidStudents = studentIds.filter((id: string) => !validStudentIds.has(id));

    if (invalidStudents.length > 0) {
      return NextResponse.json(
        { 
          error: 'Some students do not belong to the specified class/section',
          invalidStudents 
        },
        { status: 400 }
      );
    }

    // Parse date to ensure it's date-only
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Use transaction to upsert attendance records
    const result = await prisma.$transaction(
      records.map((record: { studentId: string; status: string }) =>
        prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId: record.studentId,
              date: attendanceDate,
            },
          },
          update: {
            status: record.status as any,
            markedById: teacher.id,
          },
          create: {
            studentId: record.studentId,
            date: attendanceDate,
            status: record.status as any,
            markedById: teacher.id,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Attendance marked for ${result.length} students`,
      recordsUpdated: result.length,
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}
