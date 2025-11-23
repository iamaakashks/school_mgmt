import { Role } from '@prisma/client';
import { getCurrentUser } from './auth';
import { NextResponse } from 'next/server';

/**
 * RBAC Error class for role-based access control violations
 */
export class RBACError extends Error {
  constructor(
    message: string,
    public statusCode: number = 403
  ) {
    super(message);
    this.name = 'RBACError';
  }
}

/**
 * Check if the current user has one of the allowed roles
 * Throws an RBACError if not authorized
 * 
 * Usage in API routes:
 * ```
 * await requireRole([Role.ADMIN, Role.TEACHER]);
 * ```
 */
export async function requireRole(allowedRoles: Role[]): Promise<{
  userId: string;
  email: string;
  role: Role;
}> {
  const user = await getCurrentUser();

  // Not authenticated
  if (!user) {
    throw new RBACError('Authentication required', 401);
  }

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(user.role)) {
    throw new RBACError(
      `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      403
    );
  }

  return user;
}

/**
 * Check if the current user is authenticated
 * Returns user info or throws 401
 */
export async function requireAuth(): Promise<{
  userId: string;
  email: string;
  role: Role;
}> {
  const user = await getCurrentUser();

  if (!user) {
    throw new RBACError('Authentication required', 401);
  }

  return user;
}

/**
 * Higher-order function to protect API routes with role-based access
 * 
 * Usage:
 * ```
 * export const GET = withAuth([Role.ADMIN], async (request, user) => {
 *   // Your handler logic here
 *   return NextResponse.json({ data: 'Protected data' });
 * });
 * ```
 */
export function withAuth(
  allowedRoles: Role[],
  handler: (
    request: Request,
    user: { userId: string; email: string; role: Role }
  ) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      const user = await requireRole(allowedRoles);
      return handler(request, user);
    } catch (error) {
      if (error instanceof RBACError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Get the dashboard path for a given role
 */
export function getDashboardPath(role: Role): string {
  switch (role) {
    case Role.ADMIN:
      return '/admin';
    case Role.TEACHER:
      return '/teacher';
    case Role.STUDENT:
      return '/student';
    default:
      return '/';
  }
}
