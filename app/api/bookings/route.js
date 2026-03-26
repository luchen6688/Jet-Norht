import { bookingController } from '@/server/modules/bookings/bookings.controller';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyToken(token) : null;
    return bookingController.create(request, payload?.userId);
}

export async function GET(request) {
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyToken(token) : null;
    return bookingController.list(request, payload?.userId);
}
