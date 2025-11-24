'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  qualification?: string | null;
};

export function AssignTeacherDialog({
  subjectId,
  subjectName,
  teachers,
  currentTeacherId,
}: {
  subjectId: string;
  subjectName: string;
  teachers: Teacher[];
  currentTeacherId?: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(currentTeacherId || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/subjects/${subjectId}/assign-teacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId: selectedTeacherId || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign teacher');
      }

      setOpen(false);
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error('Error assigning teacher:', error);
      alert('Failed to assign teacher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <User className="h-4 w-4 mr-2" />
        {currentTeacherId ? 'Change Teacher' : 'Assign Teacher'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Assign Teacher to Subject</DialogTitle>
              <DialogDescription>
                Select which teacher should teach "{subjectName}"
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="grid gap-2">
                <Label htmlFor="teacherId">Select Teacher</Label>
                <select
                  id="teacherId"
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  disabled={loading}
                  required
                >
                  <option value="">Select a teacher...</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                      {teacher.qualification && ` (${teacher.qualification})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !selectedTeacherId}>
                {loading ? 'Assigning...' : 'Assign Teacher'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
