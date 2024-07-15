import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
 export {default} from "next-auth/middleware"
 import { getToken } from 'next-auth/jwt'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req:request})
    const url = request.nextUrl
    console.log("token",token)
    if(token && (url.pathname.startsWith('/sign-in')||url.pathname.startsWith('/sign-up')||url.pathname.startsWith('/verify'))){
        return NextResponse.redirect(new URL('/account', request.url))
    }
    if(!token&&(url.pathname.startsWith("/register-a-club"))){
      return NextResponse.redirect(new URL("/auth/sign-in",request.url))
    }
    if(!token&&(url.pathname.startsWith('/users/me'))){
      return NextResponse.redirect(new URL("/auth/sign-in",request.url))
    }
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/sign-in','/sign-up','/dashboard/:path*','/verif/:path*','/register-a-club','/contributor/:path','/users/me']
}