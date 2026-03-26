import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'north-airways-fallback-secret'
);

const COOKIE_NAME = 'na_auth_token';

// Rutas que requieren autenticación
const PROTECTED_ROUTES = ['/mis-viajes', '/reservar', '/check-in'];

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (!isProtected) {
        return NextResponse.next();
    }

    // Leer cookie de autenticación
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => {
            const [k, ...v] = c.trim().split('=');
            return [k, v.join('=')];
        })
    );
    const token = cookies[COOKIE_NAME];

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Verificar el JWT directamente en el middleware (Edge Runtime compatible)
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.next();
    } catch {
        // Token inválido o expirado
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        loginUrl.searchParams.set('expired', '1');
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ['/mis-viajes/:path*', '/reservar/:path*', '/check-in/:path*'],
};
