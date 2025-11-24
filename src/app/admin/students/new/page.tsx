import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentAdmissionForm } from './StudentAdmissionForm';

export default async function NewStudentPage() {
  // Fetch classes and sections for dropdowns
  const classes = await prisma.class.findMany({
    orderBy: { order: 'asc' },
  });

  const sections = await prisma.section.findMany({
    include: {
      class: true,
    },
    orderBy: [
      { class: { order: 'asc' } },
      { name: 'asc' },
    ],
  });

  return (
    <DashboardLayout title="Admit Student" role="ADMIN">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admit New Student</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a student account and user credentials
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>
              Fill in all required fields to admit a new student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentAdmissionForm classes={classes} sections={sections} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
