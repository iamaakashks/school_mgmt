import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassForm } from './ClassForm';
import { ClassList } from './ClassList';

export default async function ClassesPage() {
  const classes = await prisma.class.findMany({
    include: {
      sections: true,
      _count: {
        select: {
          sections: true,
          students: true,
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });

  return (
    <DashboardLayout title="Classes Management" role="ADMIN">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Classes</h1>
              <p className="mt-2 text-sm text-slate-600">
                Manage school classes and their sections
              </p>
            </div>
            <ClassForm />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Classes</CardTitle>
            <CardDescription>
              {classes.length} {classes.length === 1 ? 'class' : 'classes'} registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClassList classes={classes} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
