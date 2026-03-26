import { bookingController } from '@/server/modules/bookings/bookings.controller';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function PATCH(request, context) {
    const { params } = context;
    const token = getTokenFromRequest(request);
    const payload = token ? await verifyToken(token) : null;
    return bookingController.update(params.id, request, payload?.userId);
}

export async function GET(request, context) {
    const { params } = context;
    return bookingController.getById(params.id);
}
