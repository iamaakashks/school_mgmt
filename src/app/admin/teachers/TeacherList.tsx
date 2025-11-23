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
        <p className="text-slate-500">No teachers found.</p>
        <p className="mt-2 text-sm text-slate-400">
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
              <TableCell>{teacher.phone || <span className="text-slate-400">-</span>}</TableCell>
              <TableCell>
                {teacher.qualification || <span className="text-slate-400">-</span>}
              </TableCell>
              <TableCell>{teacher._count.subjects}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    teacher.user.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-slate-100 text-slate-800'
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
