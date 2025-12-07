import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret';

export async function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/api/messages', '/api/chats'];

  const currentPath = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route =>
    currentPath.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.headers.get('authorization')?.split(' ')[1] ||
      request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Add user info to headers for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.id as string);
      requestHeaders.set('x-user-username', payload.username as string);
      requestHeaders.set('x-user-email', payload.email as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      });
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};