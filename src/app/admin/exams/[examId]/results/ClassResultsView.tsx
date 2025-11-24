'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Section = {
  id: string;
  name: string;
};

type StudentResult = {
  studentId: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  sectionName: string | null;
  results: {
    subjectId: string;
    subjectName: string;
    maxMarks: number;
    marks: number | null;
    grade: string | null;
  }[];
  totalMarks: number;
  totalMaxMarks: number;
  percentage: number;
};

export function ClassResultsView({
  examId,
  classId,
  sections,
}: {
  examId: string;
  classId: string;
  sections: Section[];
}) {
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<{
    exam: any;
    students: StudentResult[];
  } | null>(null);

  const handleFetchResults = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const url = selectedSection
        ? `/api/exams/${examId}/results/class?classId=${classId}&sectionId=${selectedSection}`
        : `/api/exams/${examId}/results/class?classId=${classId}`;

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch results');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <div className="flex-1 max-w-xs">
          <Label htmlFor="section">Section (Optional)</Label>
          <select
            id="section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            disabled={loading}
          >
            <option value="">All Sections</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={handleFetchResults} disabled={loading}>
          {loading ? 'Loading...' : 'Load Results'}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <h3 className="font-semibold text-foreground">
              {results.exam.name} - {results.exam.className}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(results.exam.startDate).toLocaleDateString()} -{' '}
              {new Date(results.exam.endDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {results.students.length} student(s) found
            </p>
          </div>

          {results.students.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No students found for the selected criteria.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admission No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Section</TableHead>
                    {results.students[0]?.results.map((result) => (
                      <TableHead key={result.subjectId} className="text-center">
                        {result.subjectName}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          (Max: {result.maxMarks})
                        </span>
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.students.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">{student.admissionNo}</TableCell>
                      <TableCell>
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>{student.sectionName || '-'}</TableCell>
                      {student.results.map((result) => (
                        <TableCell key={result.subjectId} className="text-center">
                          {result.marks !== null ? (
                            <span className={result.marks < result.maxMarks * 0.4 ? 'text-destructive font-semibold' : ''}>
                              {result.marks}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-semibold">
                        {student.totalMarks} / {student.totalMaxMarks}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {student.percentage.toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
