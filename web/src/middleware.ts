import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Initialize Supabase client
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

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  // --- Route Protection Logic ---
  const path = request.nextUrl.pathname

  let role: string | null = null

  // 1. Try Supabase user first
  if (user && user.user_metadata) {
    role = user.user_metadata.role as string
  } 
  // 2. Fallback to custom JWT cookie (wallet auth)
  else {
    const customToken = request.cookies.get('auth_token')?.value
    if (customToken) {
      try {
        const { decodeJwt } = await import('jose')
        const payload = decodeJwt(customToken)
        if (payload && payload.roles && Array.isArray(payload.roles)) {
           role = payload.roles[0] 
        }
      } catch (e) {
        console.error("Failed to decode custom JWT in middleware", e)
      }
    }
  }

  // Define route patterns
  const isPublicRoute = path === '/' || path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/jobs') && !path.startsWith('/jobs/create')
  const isAdminRoute = path.startsWith('/admin')
  const isCompanyRoute = path.startsWith('/company')
  const isUserRoute = path.startsWith('/dashboard') || path.startsWith('/profile') || path.startsWith('/applications') || path.startsWith('/career') || path.startsWith('/settings')

  // Redirect to login if accessing protected routes without session
  if (!role && !user && (isAdminRoute || isCompanyRoute || isUserRoute)) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectedFrom', path)
    return NextResponse.redirect(redirectUrl)
  }

  if (role || user) {
    const normalizedRole = (role || 'user').toLowerCase()

    // ADMIN RULES: Can only access /admin routes. Blocked from USER and COMPANY routes.
    if (isAdminRoute && normalizedRole !== 'admin') {
        // Non-admin trying to access admin
        return NextResponse.redirect(new URL(normalizedRole === 'company' ? '/company/dashboard' : '/dashboard', request.url))
    }

    // COMPANY RULES: Can access /company/* and /dashboard
    if (isCompanyRoute && normalizedRole !== 'company') {
        // Non-company trying to access company routes
        return NextResponse.redirect(new URL(normalizedRole === 'admin' ? '/admin/dashboard' : '/dashboard', request.url))
    }

    // USER RULES: Can access /dashboard, /profile, /applications, /career, /settings
    // We also explicitly block ADMIN from accessing these to maintain strict separation,
    // but COMPANY is allowed to access /dashboard based on the spec.
    if (isUserRoute) {
        if (normalizedRole === 'admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
        if (normalizedRole === 'company' && path !== '/dashboard') {
            // Company can access /dashboard, but not other user routes like /applications
            return NextResponse.redirect(new URL('/company/dashboard', request.url))
        }
    }

    // Redirect logged-in users away from auth pages
    if (path.startsWith('/auth') || path === '/login' || path === '/signup') {
      if (normalizedRole === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      if (normalizedRole === 'company') return NextResponse.redirect(new URL('/company/dashboard', request.url))
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
