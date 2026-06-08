import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"
import AuthUserService from "./actions/auth/AuthUser";
import { CheckAccess } from "@/actions/auth/GrantAccess"

let isLoggedIn: boolean = false;
export async function proxy(request: NextRequest) {
  // const data = await AuthUserService();
  const data = await CheckAccess();

  let token = request.cookies.get("access-token");
  if (token?.value) {
    if (data.status === true) {
      isLoggedIn = true;
    }
  } else {
    isLoggedIn = false;
  }

  if (isLoggedIn) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login-otp", request.url));
}

export const config = {
  matcher: ["/consoles", "/consoles", "/consoles/:path*", "/profile", "/profile/:path*"]
};
