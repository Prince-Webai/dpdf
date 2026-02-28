import { NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/session'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const runtime = 'edge'

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - static image files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
