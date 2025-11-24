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
    const { classId } = body;

    // Update subject with new grade/class
    await prisma.subject.update({
      where: { id: subjectId },
      data: {
        classId: classId || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Grade assigned successfully',
    });
  } catch (error) {
    console.error('Error assigning grade:', error);
    return NextResponse.json(
      { error: 'Failed to assign grade' },
      { status: 500 }
    );
  }
}
