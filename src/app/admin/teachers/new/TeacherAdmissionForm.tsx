'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function TeacherAdmissionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        empCode: formData.get('empCode') as string,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        phone: formData.get('phone') as string,
        qualification: formData.get('qualification') as string,
      };

      const response = await fetch('/api/admin/admissions/teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to admit teacher');
      }

      // Success - redirect to teachers list
      alert('Teacher admitted successfully!');
      router.push('/admin/teachers');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      {/* Account Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="teacher@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Initial Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              required
              disabled={loading}
              minLength={8}
            />
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="empCode">Employee Code *</Label>
            <Input
              id="empCode"
              name="empCode"
              placeholder="TCH0001"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualification">Qualification</Label>
          <Input
            id="qualification"
            name="qualification"
            placeholder="e.g., B.Ed. in Mathematics, M.Sc. in Physics"
            disabled={loading}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
        >
          {loading ? 'Admitting Teacher...' : 'Admit Teacher'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/teachers')}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
