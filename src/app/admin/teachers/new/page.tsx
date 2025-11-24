import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeacherAdmissionForm } from './TeacherAdmissionForm';

export default function NewTeacherPage() {
  return (
    <DashboardLayout title="Admit Teacher" role="ADMIN">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admit New Teacher</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a teacher account and user credentials
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teacher Information</CardTitle>
            <CardDescription>
              Fill in all required fields to admit a new teacher
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeacherAdmissionForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
