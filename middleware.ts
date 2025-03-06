// middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// Define protected routes and admin routes
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/\\[orgId\\]/(.*)', // Match dynamic orgId routes
  '/api(.*)',
]);

const isAdminRoute = createRouteMatcher([
  '/\\[orgId\\]/settings(.*)',
  '/\\[orgId\\]/members(.*)',
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/pricing',
  '/about',
]);

export default clerkMiddleware(async (auth, req) => {
  // Debugging in development
  const debug = process.env.NODE_ENV === 'development';

  // Skip middleware for public routes
  if (isPublicRoute(req)) {
    if (debug) {
      console.log('Allowing public route:', req.nextUrl.pathname);
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute(req)) {
    if (debug) {
      console.log('Processing protected route:', req.nextUrl.pathname);
    }

    // Verify authentication
    const { userId, orgId, sessionClaims } = await auth();

    // Redirect unauthenticated users
    if (!userId) {
      if (debug) {
        console.log('Redirecting to sign-in');
      }
      return (await auth()).redirectToSignIn({ returnBackUrl: req.url });
    }

    // Handle organization context
    if (!orgId && !req.nextUrl.pathname.startsWith('/create-org')) {
      if (debug) {
        console.log('Redirecting to organization creation');
      }
      return NextResponse.redirect(new URL('/create-org', req.url));
    }

    // Verify admin permissions for admin routes
    if (isAdminRoute(req)) {
      if (debug) {
        console.log('Checking admin permissions');
      }
      const { permissions } = sessionClaims;
      if (Array.isArray(permissions)) {
        const hasAdminAccess = permissions.includes('org:sys_profile:manage') ||
          permissions.includes('org:sys_memberships:manage');
        if (!hasAdminAccess) {
          if (debug) {
            console.log('Admin access denied');
          }
          return new NextResponse('Unauthorized', { status: 401 });
        }
      } else {
        if (debug) {
          console.log('No permissions found');
        }
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }

    // Add organization context to headers for backend
    const headers = new Headers(req.headers);
    headers.set('x-org-id', orgId || '');

    return NextResponse.next({
      request: {
        headers
      }
    });
  }

  return NextResponse.next();
}, { debug: process.env.NODE_ENV === 'development' });

export const config = {
  matcher: [
    '/((?!_next|_vercel|[^?]*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
}