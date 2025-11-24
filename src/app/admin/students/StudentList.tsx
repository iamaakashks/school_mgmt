'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type StudentWithRelations = {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  joinDate: Date;
  user: {
    email: string;
    status: string;
  };
  class: {
    id: string;
    name: string;
  } | null;
  section: {
    id: string;
    name: string;
  } | null;
};

export function StudentList({ students }: { students: StudentWithRelations[] }) {
  if (students.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No students found.</p>
        <p className="mt-2 text-sm text-muted-foreground/70">
          Student admission functionality will be added in the next phase.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Admission No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class - Section</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-mono text-sm">{student.admissionNo}</TableCell>
              <TableCell className="font-semibold">
                {student.firstName} {student.lastName}
              </TableCell>
              <TableCell>
                {student.class && student.section ? (
                  `${student.class.name} - ${student.section.name}`
                ) : (
                  <span className="text-muted-foreground">Not assigned</span>
                )}
              </TableCell>
              <TableCell>{new Date(student.joinDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    student.user.status === 'ACTIVE'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {student.user.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
