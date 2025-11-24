import DashboardLayout from '@/components/DashboardLayout';
import { prisma } from '@/lib/db';
import { AttendanceMarkingForm } from './AttendanceMarkingForm';

export default async function TeacherAttendancePage() {
  // Fetch classes and sections for the dropdown
  const classes = await prisma.class.findMany({
    include: {
      sections: {
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });

  return (
    <DashboardLayout title="Mark Attendance" role="TEACHER">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mark Attendance</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a class, section, and date to mark student attendance
          </p>
        </div>

        <AttendanceMarkingForm classes={classes} />
      </div>
    </DashboardLayout>
  );
}
