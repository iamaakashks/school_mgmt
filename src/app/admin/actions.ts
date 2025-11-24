'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/rbac';
import { Role } from '@prisma/client';

// Class Actions
export async function createClass(formData: FormData) {
  await requireRole([Role.ADMIN]);

  const name = formData.get('name') as string;
  const order = parseInt(formData.get('order') as string);

  if (!name || isNaN(order)) {
    throw new Error('Name and order are required');
  }

  await prisma.class.create({
    data: { name, order },
  });

  revalidatePath('/admin/classes');
  return { success: true };
}

export async function updateClass(id: string, formData: FormData) {
  await requireRole([Role.ADMIN]);

  const name = formData.get('name') as string;
  const order = parseInt(formData.get('order') as string);

  await prisma.class.update({
    where: { id },
    data: { name, order },
  });

  revalidatePath('/admin/classes');
  return { success: true };
}

export async function deleteClass(id: string) {
  await requireRole([Role.ADMIN]);

  await prisma.class.delete({
    where: { id },
  });

  revalidatePath('/admin/classes');
  return { success: true };
}

// Section Actions
export async function createSection(formData: FormData) {
  await requireRole([Role.ADMIN]);

  const name = formData.get('name') as string;
  const classId = formData.get('classId') as string;

  if (!name || !classId) {
    throw new Error('Name and class are required');
  }

  await prisma.section.create({
    data: { name, classId },
  });

  revalidatePath('/admin/sections');
  return { success: true };
}

export async function updateSection(id: string, formData: FormData) {
  await requireRole([Role.ADMIN]);

  const name = formData.get('name') as string;
  const classId = formData.get('classId') as string;

  await prisma.section.update({
    where: { id },
    data: { name, classId },
  });

  revalidatePath('/admin/sections');
  return { success: true };
}

export async function deleteSection(id: string) {
  await requireRole([Role.ADMIN]);

  await prisma.section.delete({
    where: { id },
  });

  revalidatePath('/admin/sections');
  return { success: true };
}

// Subject Actions
export async function createSubject(formData: FormData) {
  await requireRole([Role.ADMIN]);

  const name = formData.get('name') as string;
  const code = formData.get('code') as string;
  const classId = formData.get('classId') as string;
  const teacherId = formData.get('teacherId') as string;

  if (!name || !code) {
    throw new Error('Name and code are required');
  }

  // Handle empty strings from select dropdowns
  const classIdValue = classId && classId !== '' ? classId : null;
  const teacherIdValue = teacherId && teacherId !== '' ? teacherId : null;

  await prisma.subject.create({
    data: {
      name,
      code,
      classId: classIdValue,
      teacherId: teacherIdValue,
    },
  });

  revalidatePath('/admin/subjects');
  return { success: true };
}

export async function updateSubject(id: string, formData: FormData) {
  await requireRole([Role.ADMIN]);

  const name = formData.get('name') as string;
  const code = formData.get('code') as string;
  const classId = formData.get('classId') as string || null;
  const teacherId = formData.get('teacherId') as string || null;

  await prisma.subject.update({
    where: { id },
    data: {
      name,
      code,
      classId: classId || null,
      teacherId: teacherId || null,
    },
  });

  revalidatePath('/admin/subjects');
  return { success: true };
}

export async function deleteSubject(id: string) {
  await requireRole([Role.ADMIN]);

  await prisma.subject.delete({
    where: { id },
  });

  revalidatePath('/admin/subjects');
  return { success: true };
}
