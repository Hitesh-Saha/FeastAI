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
 
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const session = await getSession()

  // Check if the route requires authentication
  const isAuthRequired = authRequiredRoutes.some(route => path.startsWith(route))
  const isPublicOnly = publicOnlyRoutes.includes(path)
  const isPublic = publicRoutes.some(route => path === route)

  // Redirect to login if trying to access auth-required routes without session
  if (isAuthRequired && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect authenticated users away from login/signup pages
  if (isPublicOnly && session?.userId) {
    return NextResponse.redirect(new URL('/recipes', req.nextUrl))
  }

  // Allow access to public routes and all other routes
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}