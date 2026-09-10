import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // Keep the public site available when Supabase credentials have not been
  // configured yet. Authenticated features will start working once the
  // publishable credentials are added to the deployment environment.
  if (!supabaseUrl || !supabaseKey || supabaseKey === 'your_supabase_publishable_key') {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: (items) => {
      items.forEach(({ name, value }) => request.cookies.set(name, value))
      response = NextResponse.next({ request })
      items.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
    } } },
  )
  await supabase.auth.getUser()
  return response
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'] }
