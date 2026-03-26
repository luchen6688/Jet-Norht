import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'north-airways-fallback-secret'
);

const COOKIE_NAME = 'na_auth_token';
const TOKEN_EXPIRY = '7d';

/**
 * Firma un JWT con los datos del usuario
 */
export async function signToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(JWT_SECRET);
}

/**
 * Verifica y decodifica un JWT
 * Retorna el payload o null si es inválido/expirado
 */
export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}

/**
 * Construye los headers de la cookie de autenticación (Set-Cookie)
 */
export function buildAuthCookie(token) {
    const maxAge = 60 * 60 * 24 * 7; // 7 días en segundos
    return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict`;
}

/**
 * Construye los headers para eliminar la cookie de autenticación
 */
export function clearAuthCookie() {
    return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`;
}

/**
 * Extrae el token de la cookie de una Request
 */
export function getTokenFromRequest(request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => {
            const [k, ...v] = c.trim().split('=');
            return [k, v.join('=')];
        })
    );
    return cookies[COOKIE_NAME] || null;
}

export { COOKIE_NAME };
