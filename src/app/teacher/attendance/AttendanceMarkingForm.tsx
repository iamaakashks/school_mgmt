'use client';

import { useState, useEffect } from 'react';
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

type AttendanceRecord = {
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
};

const STATUS_OPTIONS = [
  { value: 'PRESENT', label: 'Present', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' },
  { value: 'ABSENT', label: 'Absent', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' },
  { value: 'LATE', label: 'Late', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' },
  { value: 'EXCUSED', label: 'Excused', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' },
];

export function AttendanceMarkingForm({ classes }: { classes: Class[] }) {
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const availableSections = selectedClass?.sections || [];

  // Reset section when class changes
  useEffect(() => {
    setSelectedSectionId('');
    setStudents([]);
    setAttendanceRecords({});
  }, [selectedClassId]);

  // Load students when class, section, or date changes
  useEffect(() => {
    if (selectedClassId && selectedSectionId && selectedDate) {
      loadStudents();
    }
  }, [selectedClassId, selectedSectionId, selectedDate]);

  async function loadStudents() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/attendance/class?classId=${selectedClassId}&sectionId=${selectedSectionId}&date=${selectedDate}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load students');
      }

      const data = await response.json();
      setStudents(data.students);

      // Initialize attendance records with existing data or default to PRESENT
      const records: Record<string, string> = {};
      data.students.forEach((student: Student) => {
        records[student.studentId] = student.status || 'PRESENT';
      });
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error loading students:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load students';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  }

  function updateAttendanceStatus(studentId: string, status: string) {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status,
    }));
  }

  function markAllAs(status: string) {
    const records: Record<string, string> = {};
    students.forEach(student => {
      records[student.studentId] = status;
    });
    setAttendanceRecords(records);
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const records: AttendanceRecord[] = students.map(student => ({
        studentId: student.studentId,
        status: attendanceRecords[student.studentId] as any,
      }));

      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: selectedClassId,
          sectionId: selectedSectionId,
          date: selectedDate,
          records,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save attendance');
      }

      const result = await response.json();
      setMessage({ 
        type: 'success', 
        text: `Attendance saved successfully for ${result.recordsUpdated} students!` 
      });

      // Reload to show updated markedAt times
      await loadStudents();
    } catch (error) {
      console.error('Error saving attendance:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save attendance' 
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class and Date</CardTitle>
          <CardDescription>Choose the class, section, and date to mark attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <select
                id="class"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
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
                onChange={(e) => setSelectedSectionId(e.target.value)}
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
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Display */}
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Students List */}
      {students.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Student Attendance ({students.length})</CardTitle>
                <CardDescription>
                  Mark attendance for each student
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAs('PRESENT')}
                >
                  All Present
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAs('ABSENT')}
                >
                  All Absent
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Loading students...</div>
            ) : (
              <div className="space-y-3">
                {students.map((student) => (
                  <div
                    key={student.studentId}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.admissionNo}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => updateAttendanceStatus(student.studentId, option.value)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                            attendanceRecords[student.studentId] === option.value
                              ? option.color
                              : 'bg-muted text-muted-foreground hover:bg-accent'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {students.length > 0 && (
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedClassId('');
                    setSelectedSectionId('');
                    setStudents([]);
                    setAttendanceRecords({});
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {saving ? 'Saving...' : 'Save Attendance'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && selectedClassId && selectedSectionId && students.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No students found in this class and section.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
