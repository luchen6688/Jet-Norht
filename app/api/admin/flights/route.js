import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { flightRepository } from '@/server/modules/flights/flights.repository';
import { auditRepository } from '@/server/modules/audit/audit.repository';

export async function GET(request) {
    try {
        const token = getTokenFromRequest(request);
        const payload = token ? await verifyToken(token) : null;

        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const flights = flightRepository.findAll();
        return NextResponse.json({ flights });
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

        const { id, price, gate } = await request.json();
        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
        }

        flightRepository.updateFlight(id, { price, gate });
        
        auditRepository.create({
            userId: payload.id,
            event: 'Actualización de Vuelo',
            detail: `Vuelo ID ${id} actualizado (Precio: ${price || 'N/A'}, Puerta: ${gate || 'N/A'})`,
            ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1'
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
