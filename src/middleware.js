// middleware.js
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-key";

// Define which paths should be protected
// Add any paths that should require authentication
const PROTECTED_PATHS = [
  "/dashboard",
  "/profile",
  "/settings",
  "/api/protected",
];

// Define paths that should be accessible without authentication
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/api/users/login",
  "/api/users/register",
  "/forgot-password",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if path should be publicly accessible
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check if path needs protection
  const requiresAuth = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (!requiresAuth) {
    return NextResponse.next();
  }

  // Check for token in cookies
  const token = request.cookies.get("token")?.value;

  // Also check authorization header for API routes
  const authHeader = request.headers.get("authorization");
  const headerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

  // Use token from either source
  const jwtToken = token || headerToken;

  if (!jwtToken) {
    // If accessing an API route, return unauthorized status
    if (pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Authentication required" }),
        { status: 401, headers: { "content-type": "application/json" } }
      );
    }

    // For page routes, redirect to login
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    // Verify the token
    const decoded = verify(jwtToken, JWT_SECRET);

    // Add user info to headers to be accessible in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.id || decoded.userId || "");
    requestHeaders.set("x-user-role", decoded.role || "user");

    // Continue with the request with added headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("JWT verification failed:", error.message);

    // If token is invalid, clear it
    const response = pathname.startsWith("/api/")
      ? new NextResponse(
          JSON.stringify({
            success: false,
            message: "Invalid or expired token",
          }),
          { status: 401, headers: { "content-type": "application/json" } }
        )
      : NextResponse.redirect(new URL("/login", request.url));

    // Clear the invalid token
    response.cookies.delete("token");

    return response;
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
