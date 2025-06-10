// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value

//   const isProtected = request.nextUrl.pathname.startsWith('/dashboard')

//   if (isProtected && !token) {
//     const loginUrl = new URL('/login', request.url)
//     return NextResponse.redirect(loginUrl)
//   }

//   return NextResponse.next()
// }

// // Only run middleware on these routes
// export const config = {
//   matcher: ['/dashboard/:path*'], // Protect everything under /dashboard
// }
