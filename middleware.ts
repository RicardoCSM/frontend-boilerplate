import { type NextRequest } from "next/server";
import { getCurrentUserInfo, getToken } from "./app/actions/auth";

export async function middleware(request: NextRequest) {
  const token = await getToken();
  const user = await getCurrentUserInfo();

  if (user && request.nextUrl.pathname === "/") {
    if (user?.permissions.includes("ALL-access-admin-panel")) {
      return Response.redirect(new URL("/admin", request.url));
    } else {
      return Response.redirect(new URL("/home", request.url));
    }
  }

  if (
    user &&
    !user?.permissions.includes("ALL-access-admin-panel") &&
    request.nextUrl.pathname.startsWith("/admin")
  ) {
    return Response.redirect(new URL("/home", request.url));
  }

  if (
    !token &&
    !user &&
    !request.nextUrl.pathname.startsWith("/questionnaires") &&
    !request.nextUrl.pathname.startsWith("/auth/login") &&
    !request.nextUrl.pathname.startsWith("/auth/forgot-password") &&
    !request.nextUrl.pathname.startsWith("/auth/reset-password") &&
    !request.nextUrl.pathname.startsWith("/auth/reset-password") &&
    !request.nextUrl.pathname.startsWith("/images")
  ) {
    return Response.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
