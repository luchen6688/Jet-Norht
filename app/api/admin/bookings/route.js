import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { bookingRepository } from '@/server/modules/bookings/bookings.repository';
import { auditRepository } from '@/server/modules/audit/audit.repository';

export async function GET(request) {
    try {
        const token = getTokenFromRequest(request);
        const payload = token ? await verifyToken(token) : null;

        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const origin = searchParams.get('origin');
        const destination = searchParams.get('destination');

        const bookings = bookingRepository.findAll({ status, origin, destination });
        return NextResponse.json({ bookings });
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

        const { id, status } = await request.json();
        if (!id || !status) {
            return NextResponse.json({ error: 'ID y estado son requeridos' }, { status: 400 });
        }

        bookingRepository.updateStatus(id, status);
        
        auditRepository.create({
            userId: payload.id,
            event: 'Actualización de Reserva',
            detail: `Estado de reserva ID ${id} cambiado a ${status}`,
            ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1'
        });
        
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
