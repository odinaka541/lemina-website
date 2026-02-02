import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // DEMO MODE: Bypass all auth checks for performance
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // ORIGINAL LOGIC (Commented out for Demo)
  /*
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create an authenticated Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected Routes Pattern
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/network') ||
    request.nextUrl.pathname.startsWith('/settings') ||
    request.nextUrl.pathname.startsWith('/portfolio') ||
    request.nextUrl.pathname.startsWith('/alerts')

  // Auth Route Pattern
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

  // Redirect Logic
  if (isProtectedRoute && !user) {
    // If accessing protected route without user, redirect to login
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (isAuthRoute && user && !request.nextUrl.pathname.startsWith('/auth/callback')) {
    // If accessing login page WITH user, redirect to dashboard
    // Exception: allow callback route to process
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes - allow them to handle their own auth or be public)
     * - public folder files (svgs, jpgs, etc - implicitly handled by _next exclusion often, but good to be safe if strictly typed)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}