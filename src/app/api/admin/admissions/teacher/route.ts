import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { requireRole } from '@/lib/rbac';
import { Role, UserStatus } from '@prisma/client';

// Validation schema for teacher admission
const teacherAdmissionSchema = z.object({
  // User fields
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  
  // Teacher fields
  empCode: z.string().min(1, 'Employee code is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  qualification: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireRole([Role.ADMIN]);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = teacherAdmissionSchema.parse(body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    // Check if employee code already exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { empCode: validatedData.empCode },
    });

    if (existingTeacher) {
      return NextResponse.json(
        { error: 'A teacher with this employee code already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create user and teacher in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash,
          role: Role.TEACHER,
          status: UserStatus.ACTIVE,
        },
      });

      // Create teacher
      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          empCode: validatedData.empCode,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          phone: validatedData.phone,
          qualification: validatedData.qualification,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });

      return teacher;
    });

    return NextResponse.json(
      {
        message: 'Teacher admitted successfully',
        teacher: result,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    // Handle Prisma unique constraint errors
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A record with this unique field already exists' },
          { status: 400 }
        );
      }
    }

    console.error('Teacher admission error:', error);
    return NextResponse.json(
      { error: 'Failed to admit teacher. Please try again.' },
      { status: 500 }
    );
  }
}
