import { NextRequest, NextResponse } from "next/server";

// Configurable lists
const PUBLIC_PAGES = ["/"]; // Pages allowed without a token
const PROTECTED_API_ROUTES = ["/api/cookies"]; // API routes that require a token

export function middleware(req: NextRequest) {
    const token = req.cookies.get("xtk")?.value || null;
    const { pathname } = req.nextUrl;
    const isApi = pathname.startsWith("/api");

    // Allow static files and internal paths
    if (
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico" ||
        /\.(jpg|jpeg|png|svg|ico|pdf|gif|webp|css|js)$/.test(pathname)
    ) {
        return NextResponse.next();
    }

    const isPublicPage = PUBLIC_PAGES.includes(pathname);
    const isProtectedApi = PROTECTED_API_ROUTES.some(route => pathname.startsWith(route));

    if (!token) {
        // No token present
        if (isApi && isProtectedApi) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!isApi && isPublicPage) {
            return NextResponse.next(); // e.g. "/"
        }

        return isApi
            ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            : NextResponse.redirect(new URL("/", req.url));
    } else {
        // Token exists
        if (!isApi && isPublicPage) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next(); // All good
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
