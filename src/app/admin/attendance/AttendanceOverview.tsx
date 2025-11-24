'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type Class = {
  id: string;
  name: string;
  sections: {
    id: string;
    name: string;
  }[];
};

type Student = {
  studentId: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  status: string | null;
  markedAt: string | null;
};

export function AttendanceOverview({ classes }: { classes: Class[] }) {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    notMarked: number;
  } | null>(null);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const availableSections = selectedClass?.sections || [];

  async function loadAttendance() {
    if (!selectedClassId || !selectedSectionId || !viewDate) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/attendance/class?classId=${selectedClassId}&sectionId=${selectedSectionId}&date=${viewDate}`
      );

      if (!response.ok) {
        throw new Error('Failed to load attendance');
      }

      const data = await response.json();
      setStudents(data.students);

      // Calculate statistics
      const total = data.students.length;
      const present = data.students.filter((s: Student) => s.status === 'PRESENT').length;
      const absent = data.students.filter((s: Student) => s.status === 'ABSENT').length;
      const late = data.students.filter((s: Student) => s.status === 'LATE').length;
      const excused = data.students.filter((s: Student) => s.status === 'EXCUSED').length;
      const notMarked = data.students.filter((s: Student) => !s.status).length;

      setStats({ total, present, absent, late, excused, notMarked });
    } catch (error) {
      console.error('Error loading attendance:', error);
      alert('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: string | null) => {
    if (!status) {
      return (
        <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-muted text-muted-foreground">
          Not Marked
        </span>
      );
    }

    const styles = {
      PRESENT: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      ABSENT: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
      LATE: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      EXCUSED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
    };

    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          styles[status as keyof typeof styles] || 'bg-muted text-muted-foreground'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Select class, section, and date to view attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <select
                id="class"
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setSelectedSectionId('');
                  setStudents([]);
                  setStats(null);
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <select
                id="section"
                value={selectedSectionId}
                onChange={(e) => {
                  setSelectedSectionId(e.target.value);
                  setStudents([]);
                  setStats(null);
                }}
                disabled={!selectedClassId}
                className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
              >
                <option value="">Select a section...</option>
                {availableSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={viewDate}
                onChange={(e) => {
                  setViewDate(e.target.value);
                  setStudents([]);
                  setStats(null);
                }}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2 flex items-end">
              <Button
                onClick={loadAttendance}
                disabled={!selectedClassId || !selectedSectionId || !viewDate || loading}
                className="w-full"
              >
                {loading ? 'Loading...' : 'View Attendance'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Students</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Present</CardDescription>
              <CardTitle className="text-3xl text-green-600 dark:text-green-400">
                {stats.present}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Absent</CardDescription>
              <CardTitle className="text-3xl text-red-600 dark:text-red-400">
                {stats.absent}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Late</CardDescription>
              <CardTitle className="text-3xl text-yellow-600 dark:text-yellow-400">
                {stats.late}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Excused</CardDescription>
              <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">
                {stats.excused}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Not Marked</CardDescription>
              <CardTitle className="text-3xl text-muted-foreground">
                {stats.notMarked}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Attendance Percentage */}
      {stats && stats.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="text-5xl font-bold text-foreground">
                  {((stats.present + stats.late) / stats.total * 100).toFixed(1)}%
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stats.present + stats.late} out of {stats.total} students present/late
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student List */}
      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Student Attendance Details</CardTitle>
            <CardDescription>
              {new Date(viewDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                      Admission No.
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                      Student Name
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-foreground">
                      Marked At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.studentId} className="border-b border-border hover:bg-accent/50">
                      <td className="py-3 px-4 text-sm font-mono text-foreground">
                        {student.admissionNo}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-foreground">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(student.status)}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                        {student.markedAt
                          ? new Date(student.markedAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
