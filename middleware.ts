import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected API routes that require authentication (admin operations)
const protectedApiRoutes = [
  '/api/services',
  '/api/blogs', 
  '/api/testimonials',
  '/api/storage'
];

// Public API routes that don't require authentication (frontend data)
const publicApiRoutes = [
  '/api/public/services',
  '/api/public/blogs',
  '/api/public/testimonials'
];

// Admin pages that require authentication
const protectedAdminPages = [
  '/admin/panel'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a public API route (allow access)
  const isPublicApiRoute = publicApiRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If it's a public route, allow access
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  // Check if this is a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if this is a protected admin page
  const isProtectedAdminPage = protectedAdminPages.some(route => 
    pathname.startsWith(route)
  );

  // For API routes, check for admin authentication header
  if (isProtectedApiRoute) {
    const authHeader = request.headers.get('x-admin-auth');
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    // Simple token-based auth for API routes
    const expectedToken = adminUsername && adminPassword 
      ? Buffer.from(`${adminUsername}:${adminPassword}`).toString('base64')
      : null;

    if (!authHeader || authHeader !== expectedToken) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // For admin pages, redirect to login if not authenticated
  if (isProtectedAdminPage) {
    const authCookie = request.cookies.get('admin-auth');
    
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match admin panel routes
    '/admin/panel/:path*'
  ],
}; 