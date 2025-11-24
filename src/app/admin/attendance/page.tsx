import DashboardLayout from '@/components/DashboardLayout';
import { prisma } from '@/lib/db';
import { AttendanceOverview } from './AttendanceOverview';

export default async function AdminAttendancePage() {
  // Fetch classes and sections for the filter
  const classes = await prisma.class.findMany({
    include: {
      sections: {
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });

  return (
    <DashboardLayout title="Attendance Overview" role="ADMIN">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Attendance Overview</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View and analyze attendance records across classes and sections
          </p>
        </div>

        <AttendanceOverview classes={classes} />
      </div>
    </DashboardLayout>
  );
}
