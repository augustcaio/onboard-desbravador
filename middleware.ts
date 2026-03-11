import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const isOnLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isOnApiPage = request.nextUrl.pathname.startsWith("/api");

  if (!token && !isOnLoginPage && !isOnApiPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isOnLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};
