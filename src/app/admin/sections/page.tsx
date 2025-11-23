import { prisma } from '@/lib/db';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionForm } from './SectionForm';
import { SectionList } from './SectionList';

export default async function SectionsPage() {
  const [sections, classes] = await Promise.all([
    prisma.section.findMany({
      include: {
        class: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: [
        { class: { order: 'asc' } },
        { name: 'asc' },
      ],
    }),
    prisma.class.findMany({
      orderBy: { order: 'asc' },
    }),
  ]);

  return (
    <DashboardLayout title="Sections Management" role="ADMIN">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Sections</h1>
              <p className="mt-2 text-sm text-slate-600">
                Manage class sections and student groups
              </p>
            </div>
            <SectionForm classes={classes} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Sections</CardTitle>
            <CardDescription>
              {sections.length} {sections.length === 1 ? 'section' : 'sections'} across all classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SectionList sections={sections} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
