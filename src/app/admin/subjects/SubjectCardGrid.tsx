'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, School, User, Plus, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  } | null;
  _count: {
    examSubjects: number;
  };
};

export function SubjectCardGrid({ subjects, onAddClick }: { subjects: Subject[]; onAddClick: () => void }) {

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* Add Subject Card */}
      <Card 
        onClick={onAddClick}
        className="h-full border-2 border-dashed border-muted-foreground/25 hover:border-green-500 hover:bg-green-500/5 transition-all cursor-pointer group"
      >
        <CardContent className="flex flex-col items-center justify-center h-56 text-center">
          <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
            <Plus className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-lg text-muted-foreground group-hover:text-green-600">
            Add New Subject
          </CardTitle>
          <CardDescription className="mt-2">
            Click here to create a new subject
          </CardDescription>
        </CardContent>
      </Card>

      {/* Individual Subject Cards */}
      {subjects.map((subject) => (
        <Link key={subject.id} href={`/admin/subjects/${subject.id}`}>
          <Card className="h-full hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer border-l-4 border-l-blue-500 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors">
                    {subject.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {subject.code}
                    </Badge>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Grade/Class */}
                <div className="flex items-center text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">Grade:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {subject.class?.name || 'Not assigned'}
                  </span>
                </div>

                {/* Teacher */}
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">Teacher:</span>
                  <span className="ml-2 font-medium text-foreground truncate">
                    {subject.teacher
                      ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                      : 'Not assigned'}
                  </span>
                </div>

                {/* Footer Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">Used in exams</span>
                  <span className="text-sm font-semibold text-foreground">
                    {subject._count.examSubjects}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
