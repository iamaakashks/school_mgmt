'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type TeacherWithRelations = {
  id: string;
  empCode: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  qualification: string | null;
  user: {
    email: string;
    status: string;
  };
  _count: {
    subjects: number;
    classTeacher: number;
  };
};

export function TeacherList({ teachers }: { teachers: TeacherWithRelations[] }) {
  if (teachers.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No teachers found.</p>
        <p className="mt-2 text-sm text-muted-foreground/70">
          Teacher admission functionality will be added in the next phase.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Qualification</TableHead>
            <TableHead>Subjects</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell className="font-mono text-sm">{teacher.empCode}</TableCell>
              <TableCell className="font-semibold">
                {teacher.firstName} {teacher.lastName}
              </TableCell>
              <TableCell>{teacher.phone || <span className="text-muted-foreground">-</span>}</TableCell>
              <TableCell>
                {teacher.qualification || <span className="text-muted-foreground">-</span>}
              </TableCell>
              <TableCell>{teacher._count.subjects}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    teacher.user.status === 'ACTIVE'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {teacher.user.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
