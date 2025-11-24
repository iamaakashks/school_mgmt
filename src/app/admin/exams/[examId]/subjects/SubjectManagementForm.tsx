'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Subject = {
  id: string;
  name: string;
  code: string;
};

type ExamSubject = {
  id: string;
  subjectId: string;
  maxMarks: number;
  subject: Subject;
};

export function SubjectManagementForm({
  examId,
  availableSubjects,
  currentSubjects,
}: {
  examId: string;
  availableSubjects: Subject[];
  currentSubjects: ExamSubject[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize subjects with current values or defaults
  const [subjects, setSubjects] = useState<{ subjectId: string; maxMarks: number }[]>(
    availableSubjects.map((subject) => {
      const existing = currentSubjects.find((es) => es.subjectId === subject.id);
      return {
        subjectId: subject.id,
        maxMarks: existing?.maxMarks || 100,
      };
    })
  );

  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(
    new Set(currentSubjects.map((es) => es.subjectId))
  );

  const handleToggleSubject = (subjectId: string) => {
    const newSelected = new Set(selectedSubjects);
    if (newSelected.has(subjectId)) {
      newSelected.delete(subjectId);
    } else {
      newSelected.add(subjectId);
    }
    setSelectedSubjects(newSelected);
  };

  const handleMaxMarksChange = (subjectId: string, value: string) => {
    const maxMarks = parseInt(value) || 0;
    setSubjects((prev) =>
      prev.map((s) => (s.subjectId === subjectId ? { ...s, maxMarks } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const selectedSubjectData = subjects.filter((s) => selectedSubjects.has(s.subjectId));

      const response = await fetch(`/api/exams/${examId}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjects: selectedSubjectData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update subjects');
      }

      setSuccess('Subjects updated successfully!');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subjects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Select</TableHead>
            <TableHead>Subject Name</TableHead>
            <TableHead>Subject Code</TableHead>
            <TableHead className="w-48">Max Marks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {availableSubjects.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedSubjects.has(subject.id)}
                  onChange={() => handleToggleSubject(subject.id)}
                  className="h-4 w-4 rounded border-gray-300"
                  disabled={loading}
                />
              </TableCell>
              <TableCell className="font-medium">{subject.name}</TableCell>
              <TableCell className="text-muted-foreground">{subject.code}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="1"
                  value={
                    subjects.find((s) => s.subjectId === subject.id)?.maxMarks || 100
                  }
                  onChange={(e) => handleMaxMarksChange(subject.id, e.target.value)}
                  disabled={loading || !selectedSubjects.has(subject.id)}
                  className="w-32"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {availableSubjects.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No subjects found for this class. Please create subjects first.
        </p>
      )}

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/exams')}
          disabled={loading}
        >
          Back to Exams
        </Button>
        <Button type="submit" disabled={loading || selectedSubjects.size === 0}>
          {loading ? 'Saving...' : 'Save Subjects'}
        </Button>
      </div>
    </form>
  );
}
