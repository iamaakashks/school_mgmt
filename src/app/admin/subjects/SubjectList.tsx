'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { deleteSubject } from '../actions';

type SubjectWithRelations = {
  id: string;
  name: string;
  code: string;
  class: {
    id: string;
    name: string;
  } | null;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
};

export function SubjectList({ subjects }: { subjects: SubjectWithRelations[] }) {
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await deleteSubject(id);
    } catch (error) {
      console.error('Failed to delete subject:', error);
      alert('Failed to delete subject. Please try again.');
    }
  }

  if (subjects.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">No subjects found. Add your first subject to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject Name</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Teacher</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map((subject) => (
          <TableRow key={subject.id}>
            <TableCell className="font-semibold">{subject.name}</TableCell>
            <TableCell className="font-mono text-sm">{subject.code}</TableCell>
            <TableCell>{subject.class?.name || <span className="text-slate-400">-</span>}</TableCell>
            <TableCell>
              {subject.teacher ? (
                `${subject.teacher.firstName} ${subject.teacher.lastName}`
              ) : (
                <span className="text-slate-400">Unassigned</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(subject.id, subject.name)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
