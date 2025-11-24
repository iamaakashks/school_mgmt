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

    // Get query parameter for explicit studentId (for admin/teacher)
    const searchParams = request.nextUrl.searchParams;
    const requestedStudentId = searchParams.get('studentId');

    let studentId: string;

    if (user.role === 'STUDENT') {
      // Students can only view their own summary
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
      // Admin/Teacher can view any student's summary if studentId is provided
      if (!requestedStudentId) {
        return NextResponse.json(
          { error: 'studentId query parameter required for admin/teacher' },
          { status: 400 }
        );
      }
      studentId = requestedStudentId;
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get student info
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        admissionNo: true,
        class: {
          select: { name: true },
        },
        section: {
          select: { name: true },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // Get all attendance records for this student
    const attendanceRecords = await prisma.attendance.findMany({
      where: { studentId: studentId },
      select: {
        date: true,
        status: true,
      },
      orderBy: { date: 'desc' },
    });

    // Calculate summary
    const totalDays = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
    const absentCount = attendanceRecords.filter(r => r.status === 'ABSENT').length;
    const lateCount = attendanceRecords.filter(r => r.status === 'LATE').length;
    const excusedCount = attendanceRecords.filter(r => r.status === 'EXCUSED').length;
    const attendancePercentage = totalDays > 0 ? ((presentCount + lateCount) / totalDays * 100).toFixed(2) : '0.00';

    // Group by month for breakdown
    const monthlyBreakdown: Record<string, any> = {};
    
    attendanceRecords.forEach(record => {
      const monthKey = new Date(record.date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyBreakdown[monthKey]) {
        monthlyBreakdown[monthKey] = {
          month: monthKey,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
        };
      }
      monthlyBreakdown[monthKey].total++;
      if (record.status === 'PRESENT') monthlyBreakdown[monthKey].present++;
      if (record.status === 'ABSENT') monthlyBreakdown[monthKey].absent++;
      if (record.status === 'LATE') monthlyBreakdown[monthKey].late++;
      if (record.status === 'EXCUSED') monthlyBreakdown[monthKey].excused++;
    });

    const monthlyData = Object.values(monthlyBreakdown).sort((a: any, b: any) => 
      b.month.localeCompare(a.month)
    );

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        admissionNo: student.admissionNo,
        class: student.class?.name || 'Not assigned',
        section: student.section?.name || 'Not assigned',
      },
      summary: {
        totalDays,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        excused: excusedCount,
        attendancePercentage: parseFloat(attendancePercentage),
      },
      monthlyBreakdown: monthlyData,
      recentRecords: attendanceRecords.slice(0, 30).map(r => ({
        date: r.date.toISOString().split('T')[0],
        status: r.status,
      })),
    });
  } catch (error) {
    console.error('Error fetching student attendance summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance summary' },
      { status: 500 }
    );
  }
}
