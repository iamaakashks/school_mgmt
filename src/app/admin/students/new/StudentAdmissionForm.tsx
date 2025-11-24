'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Class = {
  id: string;
  name: string;
  order: number;
};

type Section = {
  id: string;
  name: string;
  classId: string;
  class: {
    name: string;
  };
};

export function StudentAdmissionForm({
  classes,
  sections,
}: {
  classes: Class[];
  sections: Section[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  // Filter sections based on selected class
  const filteredSections = selectedClass
    ? sections.filter((s) => s.classId === selectedClass)
    : [];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        admissionNo: formData.get('admissionNo') as string,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        dob: formData.get('dob') as string,
        gender: formData.get('gender') as string,
        joinDate: formData.get('joinDate') as string,
        classId: formData.get('classId') as string,
        sectionId: formData.get('sectionId') as string,
        parentName: formData.get('parentName') as string,
        parentPhone: formData.get('parentPhone') as string,
        address: formData.get('address') as string,
      };

      const response = await fetch('/api/admin/admissions/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to admit student');
      }

      // Success - redirect to students list
      alert('Student admitted successfully!');
      router.push('/admin/students');
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
              placeholder="student@example.com"
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
            <Label htmlFor="admissionNo">Admission Number *</Label>
            <Input
              id="admissionNo"
              name="admissionNo"
              placeholder="STU00001"
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
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select name="gender" required disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="joinDate">Join Date *</Label>
            <Input
              id="joinDate"
              name="joinDate"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              required
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Academic Information</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="classId">Class *</Label>
            <Select
              name="classId"
              required
              disabled={loading}
              onValueChange={setSelectedClass}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sectionId">Section *</Label>
            <Select
              name="sectionId"
              required
              disabled={loading || !selectedClass}
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedClass ? "Select section" : "Select class first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredSections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Parent/Guardian Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Parent/Guardian Information</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="parentName">Parent/Guardian Name</Label>
            <Input
              id="parentName"
              name="parentName"
              placeholder="Parent's full name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentPhone">Parent/Guardian Phone</Label>
            <Input
              id="parentPhone"
              name="parentPhone"
              type="tel"
              placeholder="+1 234 567 8900"
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            placeholder="Full residential address"
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
          {loading ? 'Admitting Student...' : 'Admit Student'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/students')}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
