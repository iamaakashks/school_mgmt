'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Exam = {
  id: string;
  name: string;
  term: string | null;
  class: {
    id: string;
    name: string;
  };
  subjects: {
    id: string;
    subjectId: string;
    maxMarks: number;
    subject: {
      id: string;
      name: string;
      code: string;
    };
  }[];
};

type Class = {
  id: string;
  name: string;
  sections: {
    id: string;
    name: string;
  }[];
};

type Student = {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  sectionName: string | null;
};

export function ExamSelectionForm({ exams, classes }: { exams: Exam[]; classes: Class[] }) {
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, Record<string, string>>>({});

  const selectedExam = exams.find((e) => e.id === selectedExamId);
  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const availableSections = selectedClass?.sections || [];

  // Filter exams by selected class
  const filteredExams = selectedClassId
    ? exams.filter((e) => e.class.id === selectedClassId)
    : [];

  const handleLoadStudents = async () => {
    if (!selectedExamId || !selectedClassId) {
      setError('Please select both exam and class');
      return;
    }

    setLoading(true);
    setError('');
    setStudents([]);
    setMarks({});

    try {
      // Fetch students from the class
      const url = selectedSectionId
        ? `/api/attendance/class?classId=${selectedClassId}&sectionId=${selectedSectionId}`
        : `/api/attendance/class?classId=${selectedClassId}`;

      const studentsResponse = await fetch(url);
      if (!studentsResponse.ok) throw new Error('Failed to fetch students');
      const studentsData = await studentsResponse.json();
      setStudents(studentsData.students);

      // Fetch existing results
      const resultsUrl = selectedSectionId
        ? `/api/exams/${selectedExamId}/results/class?classId=${selectedClassId}&sectionId=${selectedSectionId}`
        : `/api/exams/${selectedExamId}/results/class?classId=${selectedClassId}`;

      const resultsResponse = await fetch(resultsUrl);
      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json();
        
        // Pre-fill existing marks
        const existingMarks: Record<string, Record<string, string>> = {};
        resultsData.students.forEach((student: any) => {
          existingMarks[student.studentId] = {};
          student.results.forEach((result: any) => {
            if (result.marks !== null) {
              existingMarks[student.studentId][result.subjectId] = result.marks.toString();
            }
          });
        });
        setMarks(existingMarks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId: string, subjectId: string, value: string) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectId]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!selectedExam) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Build records array
      const records: { studentId: string; subjectId: string; marks: number }[] = [];
      
      Object.entries(marks).forEach(([studentId, subjectMarks]) => {
        Object.entries(subjectMarks).forEach(([subjectId, markValue]) => {
          if (markValue.trim() !== '') {
            records.push({
              studentId,
              subjectId,
              marks: parseFloat(markValue),
            });
          }
        });
      });

      if (records.length === 0) {
        setError('Please enter at least one mark');
        return;
      }

      const response = await fetch(`/api/exams/${selectedExamId}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ records }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save results');
      }

      setSuccess('Results saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save results');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="class">Class *</Label>
          <select
            id="class"
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedExamId('');
              setSelectedSectionId('');
              setStudents([]);
            }}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            disabled={loading}
          >
            <option value="">Select class...</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="exam">Exam *</Label>
          <select
            id="exam"
            value={selectedExamId}
            onChange={(e) => {
              setSelectedExamId(e.target.value);
              setStudents([]);
            }}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            disabled={loading || !selectedClassId}
          >
            <option value="">Select exam...</option>
            {filteredExams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name} {exam.term && `(${exam.term})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="section">Section (Optional)</Label>
          <select
            id="section"
            value={selectedSectionId}
            onChange={(e) => {
              setSelectedSectionId(e.target.value);
              setStudents([]);
            }}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            disabled={loading || !selectedClassId}
          >
            <option value="">All sections</option>
            {availableSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button onClick={handleLoadStudents} disabled={loading || !selectedExamId} className="w-full">
            {loading ? 'Loading...' : 'Load Students'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400 border border-green-500/20">
          {success}
        </div>
      )}

      {students.length > 0 && selectedExam && (
        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="font-semibold text-foreground">
              {selectedExam.name} - {selectedExam.class.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Enter marks for {students.length} student(s)
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Section</TableHead>
                  {selectedExam.subjects.map((examSubject) => (
                    <TableHead key={examSubject.subjectId} className="text-center">
                      {examSubject.subject.name}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        (Max: {examSubject.maxMarks})
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.admissionNo}</TableCell>
                    <TableCell>
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>{student.sectionName || '-'}</TableCell>
                    {selectedExam.subjects.map((examSubject) => (
                      <TableCell key={examSubject.subjectId} className="text-center">
                        <Input
                          type="number"
                          min="0"
                          max={examSubject.maxMarks}
                          step="0.5"
                          value={marks[student.id]?.[examSubject.subjectId] || ''}
                          onChange={(e) =>
                            handleMarkChange(student.id, examSubject.subjectId, e.target.value)
                          }
                          className="w-24 text-center"
                          placeholder="0"
                          disabled={saving}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              {saving ? 'Saving...' : 'Save Results'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
