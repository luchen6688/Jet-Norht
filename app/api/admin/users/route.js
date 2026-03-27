import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { authRepository } from '@/server/modules/auth/auth.repository';
import { auditRepository } from '@/server/modules/audit/audit.repository';

export async function GET(request) {
    try {
        const token = getTokenFromRequest(request);
        const payload = token ? await verifyToken(token) : null;

        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const users = authRepository.findAll();
        return NextResponse.json({ users });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const token = getTokenFromRequest(request);
        const payload = token ? await verifyToken(token) : null;

        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id, role, is_active } = await request.json();
        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
        }

        authRepository.updateUser(id, { role, is_active });
        
        auditRepository.create({
            userId: payload.id,
            event: 'Actualización de Usuario',
            detail: `Usuario ID ${id} actualizado (Rol: ${role || 'N/A'}, Activo: ${is_active !== undefined ? is_active : 'N/A'})`,
            ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1'
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
