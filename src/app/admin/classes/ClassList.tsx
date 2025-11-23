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
import { deleteClass } from '../actions';

type ClassWithCounts = {
  id: string;
  name: string;
  order: number;
  _count: {
    sections: number;
    students: number;
  };
};

export function ClassList({ classes }: { classes: ClassWithCounts[] }) {
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}? This will affect all associated sections and students.`)) {
      return;
    }

    try {
      await deleteClass(id);
    } catch (error) {
      console.error('Failed to delete class:', error);
      alert('Failed to delete class. Please try again.');
    }
  }

  if (classes.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">No classes found. Add your first class to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Class Name</TableHead>
          <TableHead>Sections</TableHead>
          <TableHead>Students</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.map((cls) => (
          <TableRow key={cls.id}>
            <TableCell className="font-medium">{cls.order}</TableCell>
            <TableCell className="font-semibold">{cls.name}</TableCell>
            <TableCell>{cls._count.sections}</TableCell>
            <TableCell>{cls._count.students}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(cls.id, cls.name)}
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
