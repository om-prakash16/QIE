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

  // Redirect to login if accessing protected routes without session
  if (path.startsWith('/admin') || path.startsWith('/dashboard') || path.startsWith('/company')) {
    if (!role && !user) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', path)
      return NextResponse.redirect(redirectUrl)
    }

    const normalizedRole = (role || 'user').toLowerCase()

    // Role-based redirects
    if (path.startsWith('/admin') && normalizedRole !== 'admin') {
      return NextResponse.redirect(new URL(normalizedRole === 'company' ? '/company/dashboard' : '/dashboard/candidate', request.url))
    }

    if (path.startsWith('/company') && normalizedRole !== 'company' && normalizedRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/candidate', request.url))
    }
  }

  // Redirect to dashboard if logged in and accessing auth pages
  if (path.startsWith('/auth') && (user || role)) {
    const normalizedRole = (role || 'user').toLowerCase()
    if (normalizedRole === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
    if (normalizedRole === 'company') return NextResponse.redirect(new URL('/company/dashboard', request.url))
    return NextResponse.redirect(new URL('/dashboard/candidate', request.url))
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
