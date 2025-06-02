import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './lib/session'

// Routes that require authentication
const authRequiredRoutes = [
  '/recipes/history',
  '/recipes/favorites',
  '/profile',
  '/settings'
]

// Routes that are public but redirect to recipes if authenticated
const publicOnlyRoutes = ['/login', '/signup']

// Routes that are always public
const publicRoutes = ['/', '/recipes']

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const isAuthRoute = request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup'

  // If user is authenticated and trying to access auth routes, redirect to /recipes
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/recipes', request.url))
  }

  // Allow all other routes to proceed normally
  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}