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

  // Redirect to login if accessing protected routes without session
  if (path.startsWith('/admin') || path.startsWith('/dashboard') || path.startsWith('/company')) {
    if (!user) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirectedFrom', path)
      return NextResponse.redirect(redirectUrl)
    }

    const role = user.user_metadata?.role as string

    // Role-based redirects
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL(role === 'company' ? '/company/dashboard' : '/user/dashboard', request.url))
    }

    if (path.startsWith('/company') && role !== 'company' && role !== 'admin') {
      return NextResponse.redirect(new URL('/user/dashboard', request.url))
    }
  }

  // Redirect to dashboard if logged in and accessing auth pages
  if (path.startsWith('/auth') && user) {
    const role = user.user_metadata?.role as string
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    if (role === 'company') return NextResponse.redirect(new URL('/company/dashboard', request.url))
    return NextResponse.redirect(new URL('/user/dashboard', request.url))
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
