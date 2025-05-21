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


// middleware.ts
// middleware.ts
// import { NextRequest, NextResponse } from 'next/server';

// // Configurable lists
// const PUBLIC_PAGES = ['/', '/unauthorized', '/login']; // Added /unauthorized, /login
// const PROTECTED_API_ROUTES = ['/api/cookies']; // API routes requiring a token

// // Route permissions mapping
// const ROUTE_PERMISSIONS: { [key: string]: string } = {
//     '/dashboard': 'dashboard:view',
//     '/admission': 'admission:read',
//     '/attendance': 'attendance:read',
//     '/fees': 'fee:read',
//     '/students': 'student:read',
//     '/staff': 'staff:read',
//     '/scores': 'score:read',
//     '/results': 'result:read',
//     '/cbt': 'cbt:read',
//     '/communication': 'communication:read',
//     '/users/all-users': 'user:read',
//     '/lesson-plan': 'lesson-plan:read',
//     '/help': 'help:access',
//     '/configuration': 'configuration:read',
//     '/users/roles-permissions/[id]': 'sub-role:read',
//     '/superadmin-dashboard': 'superadmin-dashboard:view',
//     '/schools': 'school:read',
//     '/subscriptions': 'subscription:read',
//     '/support': 'support:read',
//     '/subjects': 'subject:read',
//     '/classes': 'class:read',
//     '/class-arms': 'class-arm:read',
// };

// export async function middleware(req: NextRequest) {
//     const token = req.cookies.get('xtk')?.value || null;
//     const { pathname } = req.nextUrl;
//     const isApi = pathname.startsWith('/api');

//     // Allow static files and internal paths
//     if (
//         pathname.startsWith('/_next') ||
//         pathname === '/favicon.ico' ||
//         /\.(jpg|jpeg|png|svg|ico|pdf|gif|webp|css|js)$/.test(pathname)
//     ) {
//         return NextResponse.next();
//     }

//     const isPublicPage = PUBLIC_PAGES.includes(pathname);
//     const isProtectedApi = PROTECTED_API_ROUTES.some((route) =>
//         pathname.startsWith(route),
//     );

//     if (!token) {
//         // No token present
//         if (isApi && isProtectedApi) {
//             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//         }

//         if (!isApi && isPublicPage) {
//             return NextResponse.next(); // e.g., "/", "/unauthorized", "/login"
//         }

//         return isApi
//             ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//             : NextResponse.redirect(new URL('/', req.url));
//     }

//     // Token exists
//     if (!isApi && isPublicPage) {
//         return NextResponse.redirect(new URL('/dashboard', req.url));
//     }

//     // Verify token via API route
//     let payload: { permissions: { name: string }[]; role: string } | null = null;
//     try {
//         const verifyUrl = new URL('/api/auth/verify', req.url);
//         const response = await fetch(verifyUrl, {
//             headers: {
//                 Cookie: `xtk=${token}`,
//             },
//         });

//         if (!response.ok) {
//             throw new Error('Token verification failed');
//         }

//         const data = await response.json();
//         payload = data.payload;
//     } catch (error) {
//         console.error('Token verification error:', error);
//         return isApi
//             ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
//             : NextResponse.redirect(new URL('/login', req.url));
//     }

//     // Bypass permission check for superAdmin
//     if (payload?.role === 'superAdmin') {
//         return NextResponse.next();
//     }

//     // Check permissions for protected routes
//     if (!isApi) {
//         // Handle dynamic routes (e.g., /users/roles-permissions/[id])
//         const matchedRoute = Object.keys(ROUTE_PERMISSIONS).find((route) => {
//             if (route.includes('[id]')) {
//                 const regex = new RegExp(`^${route.replace('[id]', '[^/]+')}$`);
//                 return regex.test(pathname);
//             }
//             return pathname === route;
//         });

//         if (matchedRoute) {
//             const requiredPermission = ROUTE_PERMISSIONS[matchedRoute];
//             const hasPermission = payload?.permissions.some(
//                 (p) => p.name === requiredPermission,
//             );

//             if (!hasPermission) {
//                 return NextResponse.redirect(new URL('/unauthorized', req.url));
//             }
//         }
//     }

//     return NextResponse.next(); // All good
// }

// export const config = {
//     matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
// };