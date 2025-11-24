import DashboardLayout from '@/components/DashboardLayout';
import { AttendanceSummary } from './AttendanceSummary';

export default function StudentAttendancePage() {
  return (
    <DashboardLayout title="My Attendance" role="STUDENT">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            View your attendance records and summary
          </p>
        </div>

        <AttendanceSummary />
      </div>
    </DashboardLayout>
  );
}
