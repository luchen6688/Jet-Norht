import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(request) {
    try {
        const token = getTokenFromRequest(request);
        const payload = token ? await verifyToken(token) : null;

        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const transactions = db.prepare(`
            SELECT t.*, u.name as user_name, u.email as user_email, b.booking_reference
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            JOIN bookings b ON t.booking_id = b.id
            ORDER BY t.created_at DESC
        `).all();

        return NextResponse.json({ transactions });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
