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
import { deleteSection } from '../actions';

type SectionWithClass = {
  id: string;
  name: string;
  class: {
    id: string;
    name: string;
    order: number;
  };
  _count: {
    students: number;
  };
};

export function SectionList({ sections }: { sections: SectionWithClass[] }) {
  async function handleDelete(id: string, className: string, sectionName: string) {
    if (!confirm(`Are you sure you want to delete ${className} - Section ${sectionName}?`)) {
      return;
    }

    try {
      await deleteSection(id);
    } catch (error) {
      console.error('Failed to delete section:', error);
      alert('Failed to delete section. Please try again.');
    }
  }

  if (sections.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">No sections found. Add your first section to get started.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class</TableHead>
          <TableHead>Section</TableHead>
          <TableHead>Students</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sections.map((section) => (
          <TableRow key={section.id}>
            <TableCell className="font-semibold">{section.class.name}</TableCell>
            <TableCell className="font-medium">{section.name}</TableCell>
            <TableCell>{section._count.students}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(section.id, section.class.name, section.name)}
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
