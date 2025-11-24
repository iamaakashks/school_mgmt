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
import { School } from 'lucide-react';

type Class = {
  id: string;
  name: string;
  order: number;
};

export function AssignGradeDialog({
  subjectId,
  subjectName,
  classes,
  currentClassId,
}: {
  subjectId: string;
  subjectName: string;
  classes: Class[];
  currentClassId?: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(currentClassId || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('classId', selectedClassId);

      const response = await fetch(`/api/admin/subjects/${subjectId}/assign-grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: selectedClassId || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign grade');
      }

      setOpen(false);
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error('Error assigning grade:', error);
      alert('Failed to assign grade. Please try again.');
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
        <School className="h-4 w-4 mr-2" />
        {currentClassId ? 'Change Grade' : 'Assign to Grade'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Assign Grade to Subject</DialogTitle>
              <DialogDescription>
                Select which grade/class should teach "{subjectName}"
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="grid gap-2">
                <Label htmlFor="classId">Select Grade/Class</Label>
                <select
                  id="classId"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  disabled={loading}
                  required
                >
                  <option value="">Select a grade...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
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
              <Button type="submit" disabled={loading || !selectedClassId}>
                {loading ? 'Assigning...' : 'Assign Grade'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
