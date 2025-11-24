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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Class = {
  id: string;
  name: string;
};

export function ExamForm({ classes }: { classes: Class[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name') as string,
        term: formData.get('term') as string,
        classId: formData.get('classId') as string,
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
      };

      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create exam');
      }

      setOpen(false);
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
          + Create Exam
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
            <DialogDescription>
              Schedule a new exam for a class
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Exam Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Mid Term 1, Final Exam"
                required
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="term">Term (Optional)</Label>
              <Input
                id="term"
                name="term"
                placeholder="e.g., Term 1, Semester 2"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="classId">Class *</Label>
              <select
                id="classId"
                name="classId"
                className="flex h-10 w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
                disabled={loading}
              >
                <option value="">Select a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  disabled={loading}
                />
              </div>
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Exam'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
