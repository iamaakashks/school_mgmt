import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { requireRole } from '@/lib/rbac';
import { Role, UserStatus, Gender } from '@prisma/client';

// Validation schema for student admission
const studentAdmissionSchema = z.object({
  // User fields
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  
  // Student fields
  admissionNo: z.string().min(1, 'Admission number is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dob: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date of birth',
  }),
  gender: z.nativeEnum(Gender),
  joinDate: z.string().optional(),
  classId: z.string().min(1, 'Class is required'),
  sectionId: z.string().min(1, 'Section is required'),
  
  // Parent/Guardian info
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  address: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireRole([Role.ADMIN]);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = studentAdmissionSchema.parse(body);

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

    // Check if admission number already exists
    const existingStudent = await prisma.student.findUnique({
      where: { admissionNo: validatedData.admissionNo },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'A student with this admission number already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create user and student in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash,
          role: Role.STUDENT,
          status: UserStatus.ACTIVE,
        },
      });

      // Create student
      const student = await tx.student.create({
        data: {
          userId: user.id,
          admissionNo: validatedData.admissionNo,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          dob: new Date(validatedData.dob),
          gender: validatedData.gender,
          joinDate: validatedData.joinDate ? new Date(validatedData.joinDate) : new Date(),
          classId: validatedData.classId,
          sectionId: validatedData.sectionId,
          parentName: validatedData.parentName,
          parentPhone: validatedData.parentPhone,
          address: validatedData.address,
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
          class: true,
          section: true,
        },
      });

      return student;
    });

    return NextResponse.json(
      {
        message: 'Student admitted successfully',
        student: result,
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

    console.error('Student admission error:', error);
    return NextResponse.json(
      { error: 'Failed to admit student. Please try again.' },
      { status: 500 }
    );
  }
}
