'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type ExamWithRelations = {
  id: string;
  name: string;
  term: string | null;
  startDate: Date;
  endDate: Date;
  class: {
    name: string;
  };
  subjects: any[];
  _count: {
    results: number;
  };
};

export function ExamList({ exams }: { exams: ExamWithRelations[] }) {
  if (exams.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No exams found. Create your first exam to get started.</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Exam Name</TableHead>
          <TableHead>Term</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Date Range</TableHead>
          <TableHead>Subjects</TableHead>
          <TableHead>Results</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((exam) => (
          <TableRow key={exam.id}>
            <TableCell className="font-semibold">{exam.name}</TableCell>
            <TableCell>{exam.term || <span className="text-muted-foreground">-</span>}</TableCell>
            <TableCell>{exam.class.name}</TableCell>
            <TableCell className="text-sm">
              {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
            </TableCell>
            <TableCell>{exam.subjects.length}</TableCell>
            <TableCell>{exam._count.results}</TableCell>
            <TableCell className="text-right space-x-2">
              <Link href={`/admin/exams/${exam.id}/subjects`}>
                <Button variant="outline" size="sm">
                  Manage Subjects
                </Button>
              </Link>
              <Link href={`/admin/exams/${exam.id}/results`}>
                <Button variant="outline" size="sm">
                  View Results
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
