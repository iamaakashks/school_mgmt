'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Role-specific styling and text
  const getRoleConfig = () => {
    switch (roleParam?.toLowerCase()) {
      case 'admin':
        return {
          title: 'Admin Login',
          description: 'Sign in to access the administrative portal',
          gradient: 'from-red-500 to-pink-600',
          bgGradientLight: 'from-red-50 via-background to-pink-50',
          bgGradientDark: 'from-red-950/20 via-background to-pink-950/20',
          icon: (
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          ),
        };
      case 'teacher':
        return {
          title: 'Teacher Login',
          description: 'Sign in to access your teaching portal',
          gradient: 'from-green-500 to-emerald-600',
          bgGradientLight: 'from-green-50 via-background to-emerald-50',
          bgGradientDark: 'from-green-950/20 via-background to-emerald-950/20',
          icon: (
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          ),
        };
      case 'student':
        return {
          title: 'Student Login',
          description: 'Sign in to access your student portal',
          gradient: 'from-blue-500 to-indigo-600',
          bgGradientLight: 'from-blue-50 via-background to-indigo-50',
          bgGradientDark: 'from-blue-950/20 via-background to-indigo-950/20',
          icon: (
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          ),
        };
      default:
        return {
          title: 'Login',
          description: 'Sign in to Springfield Academy',
          gradient: 'from-blue-600 to-indigo-600',
          bgGradientLight: 'from-blue-50 via-background to-indigo-50',
          bgGradientDark: 'from-blue-950/20 via-background to-indigo-950/20',
          icon: (
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          ),
        };
    }
  };

  const roleConfig = getRoleConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect based on user role
      const roleRoutes: Record<string, string> = {
        ADMIN: '/admin',
        TEACHER: '/teacher',
        STUDENT: '/student',
      };

      const redirectPath = roleRoutes[data.user.role] || '/';
      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br light:${roleConfig.bgGradientLight} dark:${roleConfig.bgGradientDark}`}>
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
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
                <h1 className="text-xl font-bold text-foreground">Springfield Academy</h1>
                <p className="text-xs text-muted-foreground">Digital Campus Portal</p>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${roleConfig.gradient} text-white shadow-lg`}>
                  {roleConfig.icon}
                </div>
              </div>
              <div className="text-center">
                <CardTitle className="text-2xl font-bold">{roleConfig.title}</CardTitle>
                <CardDescription className="mt-2">{roleConfig.description}</CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className={`w-full bg-gradient-to-r ${roleConfig.gradient} hover:opacity-90 transition-opacity`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Back to Home */}
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to home
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials Note (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-4 text-xs text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800">
              <p className="font-semibold">Development Mode</p>
              <p className="mt-1">
                Create an admin user via: POST /api/auth/register-admin
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
