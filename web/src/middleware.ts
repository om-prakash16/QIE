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

  const path = request.nextUrl.pathname

  // ─── LEGACY REDIRECT MAP ───────────────────────────────────────────
  // Industry standard: one prefix per role. Redirect legacy scattered routes.
  const legacyRedirects: Record<string, string> = {
    '/dashboard':              '/user/dashboard',
    '/dashboard/edit':         '/user/profile',
    '/dashboard/jobs':         '/user/dashboard',
    '/dashboard/skills':       '/user/skills',
    '/dashboard/portfolio':    '/user/dashboard',
    '/dashboard/reputation':   '/user/dashboard',
    '/dashboard/nfts':         '/user/credentials',
    '/dashboard/nft':          '/user/credentials',
    '/dashboard/insights':     '/user/insights',
    '/dashboard/career':       '/user/dashboard',
    '/dashboard/interview':    '/user/dashboard',
    '/dashboard/community':    '/user/dashboard',
    '/dashboard/settings':     '/user/settings',
    '/dashboard/resume':       '/user/profile',
    '/dashboard/enhancer':     '/user/dashboard',
    '/dashboard/assessments':  '/user/dashboard',
    '/dashboard/activity':     '/user/dashboard',
    '/dashboard/saved':        '/user/saved',
    '/applications':           '/user/applications',
    '/settings':               '/user/settings',
    '/profile':                '/user/profile',
  }

  // Check for exact legacy redirect matches
  if (legacyRedirects[path]) {
    return NextResponse.redirect(new URL(legacyRedirects[path], request.url))
  }

  // Catch any remaining /dashboard/* sub-routes not explicitly mapped
  if (path.startsWith('/dashboard/') && !legacyRedirects[path]) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url))
  }

  // ─── ROLE DETECTION ────────────────────────────────────────────────
  let role: string | null = null

  // 1. Check for custom JWT cookie first (wallet/demo auth)
  const customToken = request.cookies.get('auth_token')?.value
  if (customToken) {
    try {
      const { decodeJwt } = await import('jose')
      const payload = decodeJwt(customToken)
      if (payload && payload.roles && Array.isArray(payload.roles)) {
         role = payload.roles[0]
      }
    } catch (e) {
      console.error("Middleware JWT Decode Error:", e)
    }
  }

  // 2. Fallback to Supabase user if no custom role found
  if (!role && user) {
    role = (user.user_metadata?.role as string) || 'user'
  }

  // ─── ROUTE CLASSIFICATION ─────────────────────────────────────────
  const isPublicRoute = path === '/' 
    || path.startsWith('/login') 
    || path.startsWith('/signup') 
    || path.startsWith('/auth')
    || (path.startsWith('/jobs') && !path.startsWith('/jobs/create'))
    || path.startsWith('/talent')
    || path.startsWith('/about')
    || path.startsWith('/pricing')
    || path.startsWith('/terms')
    || path.startsWith('/privacy')
    || path.startsWith('/support')
    || path.startsWith('/verify')
    || path.startsWith('/career-advice')
    || path.startsWith('/salary')
    || path.startsWith('/bounties')
    || path.startsWith('/companies')
    || path.startsWith('/search')
    || path.startsWith('/u/')

  const isAdminRoute = path.startsWith('/admin')
  const isCompanyRoute = path.startsWith('/company')
  const isUserRoute = path.startsWith('/user')

  // Public routes are always accessible
  if (isPublicRoute) return response

  // ─── AUTHENTICATION GUARD ─────────────────────────────────────────
  // Protected routes require a session
  if (!role && !user && (isAdminRoute || isCompanyRoute || isUserRoute)) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectedFrom', path)
    return NextResponse.redirect(redirectUrl)
  }

  // ─── ROLE-BASED ACCESS CONTROL ────────────────────────────────────
  if (role || user) {
    const normalizedRole = (role || 'user').toLowerCase()

    // Admin routes: admin only
    if (isAdminRoute && normalizedRole !== 'admin') {
      return NextResponse.redirect(new URL(
        normalizedRole === 'company' ? '/company/dashboard' : '/user/dashboard', 
        request.url
      ))
    }

    // Company routes: company and admin only
    if (isCompanyRoute && normalizedRole !== 'company' && normalizedRole !== 'admin') {
      return NextResponse.redirect(new URL(
        normalizedRole === 'admin' ? '/admin' : '/user/dashboard', 
        request.url
      ))
    }

    // User routes: user only (admin and company get their own dashboards)
    if (isUserRoute) {
      if (normalizedRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      if (normalizedRole === 'company') {
        return NextResponse.redirect(new URL('/company/dashboard', request.url))
      }
    }

    // Redirect logged-in users away from auth pages
    if (path.startsWith('/auth') || path === '/login' || path === '/signup') {
      if (normalizedRole === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
      if (normalizedRole === 'company') return NextResponse.redirect(new URL('/company/dashboard', request.url))
      return NextResponse.redirect(new URL('/user/dashboard', request.url))
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
