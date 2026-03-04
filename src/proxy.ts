import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/session'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export default proxy


export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
}
