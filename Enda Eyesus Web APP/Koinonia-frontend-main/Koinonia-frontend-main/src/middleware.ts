//src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Read auth store from cookie (zustand persist stores as localStorage in browser,
    // so we use a lightweight cookie approach for SSR route guard)
    const authRaw = req.cookies.get('enda-eyesus-auth')?.value;

    let token: string | null = null;
    let role: string | null = null;

    if (authRaw) {
        try {
            const parsed = JSON.parse(decodeURIComponent(authRaw));
            token = parsed?.state?.token ?? null;
            role = parsed?.state?.user?.system_role ?? parsed?.state?.user?.role ?? null;
        } catch {
            token = null;
        }
    }

    const isLoggedIn = !!token;

    // Protect /dashboard/* — redirect to login if no token
    if (pathname.startsWith('/dashboard')) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
        // Protect admin panel from non-administrators
        const isAdmin = ['SECRETARIAT_CHAIRMAN', 'SECRETARIAT_VICE', 'SECRETARIAT_SECRETARY', 'SUPER_ADMIN', 'SERVICE_MANAGER'].includes(role || '');
        if (pathname.startsWith('/dashboard/agent') && !isAdmin) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    // Already logged-in users visiting /login or /register → go to dashboard
    if ((pathname === '/login' || pathname === '/register') && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
