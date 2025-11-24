import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubjectManagement } from './SubjectManagement';

export default async function SubjectsPage() {
  // Fetch subjects with safe _count that won't fail if examSubjects table doesn't exist yet
  let subjects;
  try {
    subjects = await prisma.subject.findMany({
      include: {
        class: true,
        teacher: {
          include: {
            user: true,
          },
        },
        _count: {
          select: {
            examSubjects: true,
          },
        },
      },
      orderBy: [{ name: 'asc' }, { code: 'asc' }],
    });
  } catch (error) {
    // Fallback if examSubjects table doesn't exist yet
    console.warn('ExamSubject table not found, fetching subjects without exam count');
    subjects = await prisma.subject.findMany({
      include: {
        class: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [{ name: 'asc' }, { code: 'asc' }],
    });
    // Add default _count for compatibility
    subjects = subjects.map(s => ({ ...s, _count: { examSubjects: 0 } }));
  }

  const [classes, teachers] = await Promise.all([
    prisma.class.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.teacher.findMany({
      include: {
        user: true,
      },
      orderBy: { firstName: 'asc' },
    }),
  ]);

  return (
    <DashboardLayout title="Subjects Management" role="ADMIN">
      <SubjectManagement 
        initialSubjects={subjects} 
        classes={classes} 
        teachers={teachers} 
      />
    </DashboardLayout>
  );
}
