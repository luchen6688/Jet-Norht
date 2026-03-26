import { usuarioController } from '@/server/modules/usuario/usuario.controller';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyToken(token) : null;
    
    if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    return usuarioController.getProfile(payload.userId);
}

export async function PATCH(request) {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyToken(token) : null;
    
    if (!payload) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    
    return usuarioController.updateProfile(payload.userId, request);
}
