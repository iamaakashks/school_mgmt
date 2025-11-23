import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/auth';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/api/auth/login', '/api/auth/register-admin'];

// Define role-based route access
const ROLE_ROUTES = {
  ADMIN: ['/admin'],
  TEACHER: ['/teacher'],
  STUDENT: ['/student'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow API routes (except auth routes which are handled above)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get access token from cookies
  const accessToken = request.cookies.get('access_token')?.value;

  // No token - redirect to login
  if (!accessToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const user = verifyAccessToken(accessToken);

  // Invalid token - redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  const userRole = user.role;
  const allowedRoutes = ROLE_ROUTES[userRole] || [];

  // Check if user is trying to access a role-specific route
  const isRoleRoute = Object.values(ROLE_ROUTES).flat().some(route => 
    pathname.startsWith(route)
  );

  if (isRoleRoute) {
    // Check if user has access to this route
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));

    if (!hasAccess) {
      // Redirect to user's correct dashboard
      const correctDashboard = allowedRoutes[0] || '/';
      return NextResponse.redirect(new URL(correctDashboard, request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
