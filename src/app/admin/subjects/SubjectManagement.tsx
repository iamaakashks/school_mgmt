'use client';

import { useState } from 'react';
import { SubjectCardGrid } from './SubjectCardGrid';
import { SubjectForm } from './SubjectForm';

type Subject = {
  id: string;
  name: string;
  code: string;
  class: {
    name: string;
  } | null;
  teacher: {
    firstName: string;
    lastName: string;
    user: {
      email: string;
    };
  } | null;
  _count: {
    examSubjects: number;
  };
};

type Class = {
  id: string;
  name: string;
  order: number;
};

type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  user: {
    email: string;
  };
};

export function SubjectManagement({
  initialSubjects,
  classes,
  teachers,
}: {
  initialSubjects: Subject[];
  classes: Class[];
  teachers: Teacher[];
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddClick = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subjects</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {initialSubjects.length} {initialSubjects.length === 1 ? 'subject' : 'subjects'} across all grades
            </p>
          </div>
        </div>
      </div>

      <SubjectCardGrid subjects={initialSubjects} onAddClick={handleAddClick} />

      <SubjectForm 
        classes={classes} 
        teachers={teachers} 
        isOpen={isFormOpen}
        onClose={handleFormClose}
      />
    </div>
  );
}
