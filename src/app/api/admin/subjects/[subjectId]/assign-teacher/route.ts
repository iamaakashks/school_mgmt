import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/rbac';
import { Role } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    await requireRole([Role.ADMIN]);
    const { subjectId } = await params;
    const body = await request.json();
    const { teacherId } = body;

    // Update subject with new teacher
    await prisma.subject.update({
      where: { id: subjectId },
      data: {
        teacherId: teacherId || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Teacher assigned successfully',
    });
  } catch (error) {
    console.error('Error assigning teacher:', error);
    return NextResponse.json(
      { error: 'Failed to assign teacher' },
      { status: 500 }
    );
  }
}
