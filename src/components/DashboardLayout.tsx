'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export default function DashboardLayout({ children, title, role }: DashboardLayoutProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getRoleConfig = () => {
    switch (role) {
      case 'ADMIN':
        return {
          gradient: 'from-red-500 to-pink-600',
        };
      case 'TEACHER':
        return {
          gradient: 'from-green-500 to-emerald-600',
        };
      case 'STUDENT':
        return {
          gradient: 'from-blue-500 to-indigo-600',
        };
    }
  };

  const config = getRoleConfig();

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{title}</h1>
                  <p className="text-xs text-muted-foreground">Springfield Academy</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="outline"
                  className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
