import { authController } from '@/server/modules/auth/auth.controller';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const token = getTokenFromRequest(request);
    if (!token) {
        return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return NextResponse.json({ error: 'Token inválido o expirado.' }, { status: 401 });
    }

    return authController.getMe(payload.userId);
}
