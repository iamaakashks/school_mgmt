'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AttendanceSummaryData = {
  student: {
    id: string;
    name: string;
    admissionNo: string;
    class: string;
    section: string;
  };
  summary: {
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendancePercentage: number;
  };
  monthlyBreakdown: {
    month: string;
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
  }[];
  recentRecords: {
    date: string;
    status: string;
  }[];
};

export function AttendanceSummary() {
  const [data, setData] = useState<AttendanceSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAttendanceSummary();
  }, []);

  async function loadAttendanceSummary() {
    try {
      const response = await fetch('/api/attendance/student-summary');
      
      if (!response.ok) {
        throw new Error('Failed to load attendance summary');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-muted-foreground">Loading attendance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const { student, summary, monthlyBreakdown, recentRecords } = data;

  // Determine attendance status color
  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PRESENT: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      ABSENT: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
      LATE: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      EXCUSED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
    };
    return styles[status as keyof typeof styles] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold text-foreground">{student.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admission No.</p>
              <p className="font-semibold text-foreground">{student.admissionNo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Class</p>
              <p className="font-semibold text-foreground">{student.class}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Section</p>
              <p className="font-semibold text-foreground">{student.section}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Days</CardDescription>
            <CardTitle className="text-4xl">{summary.totalDays}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Present</CardDescription>
            <CardTitle className="text-4xl text-green-600 dark:text-green-400">
              {summary.present}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Absent</CardDescription>
            <CardTitle className="text-4xl text-red-600 dark:text-red-400">
              {summary.absent}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Late</CardDescription>
            <CardTitle className="text-4xl text-yellow-600 dark:text-yellow-400">
              {summary.late}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Excused</CardDescription>
            <CardTitle className="text-4xl text-blue-600 dark:text-blue-400">
              {summary.excused}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Attendance Percentage Card */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Percentage</CardTitle>
          <CardDescription>Overall attendance rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getPercentageColor(summary.attendancePercentage)}`}>
                {summary.attendancePercentage.toFixed(1)}%
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {summary.present + summary.late} present out of {summary.totalDays} days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      {monthlyBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
            <CardDescription>Attendance summary by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyBreakdown.map((month) => (
                <div key={month.month} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">
                      {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {month.total} {month.total === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {month.present}
                      </p>
                      <p className="text-xs text-muted-foreground">Present</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {month.absent}
                      </p>
                      <p className="text-xs text-muted-foreground">Absent</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {month.late}
                      </p>
                      <p className="text-xs text-muted-foreground">Late</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {month.excused}
                      </p>
                      <p className="text-xs text-muted-foreground">Excused</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Records */}
      {recentRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Last 30 days of attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {recentRecords.map((record) => (
                <div
                  key={record.date}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                >
                  <span className="text-sm text-foreground">
                    {new Date(record.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusBadge(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Records Message */}
      {summary.totalDays === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No attendance records found. Your teacher will mark your attendance soon.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
