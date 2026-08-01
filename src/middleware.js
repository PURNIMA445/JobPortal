import { NextResponse } from "next/server";

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Safely decodes a JWT payload in the Edge runtime.
 */
function decodeJwtPayload(token) {
    try {
        const payloadBase64Url = token.split('.')[1];
        if (!payloadBase64Url) return null;

        // Convert Base64Url to standard Base64
        const base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
        
        // Edge runtime safe base64 decode
        const jsonPayload = atob(base64);
        
        // Handle potential URI encoding issues with atob
        const decodedPayload = decodeURIComponent(
            jsonPayload.split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        );

        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Failed to decode token in middleware", error);
        return null;
    }
}

// ─── Configuration ────────────────────────────────────────────────────────────

const roleDashboards = {
    ADMIN: "/dashboard/admin",
    RECRUITER: "/dashboard/recruiter",
    CANDIDATE: "/dashboard/candidate",
};

const protectedRoutes = [
    "/dashboard",
    "/profile/setup",
    "/recruiter/setup",
];

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const isProtected = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // 1. Unauthenticated access to protected routes
    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Role-based Dashboard Routing
    if (token && pathname.startsWith("/dashboard")) {
        const payload = decodeJwtPayload(token);
        
        if (payload?.role) {
            const targetDashboard = roleDashboards[payload.role];

            // If the user's role is recognized and they are trying to access a 
            // dashboard path that doesn't belong to their role
            if (targetDashboard && !pathname.startsWith(targetDashboard)) {
                return NextResponse.redirect(new URL(targetDashboard, request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/recruiter/setup",
    ],
};