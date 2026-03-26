import { auditController } from '@/server/modules/audit/audit.controller';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const token = getTokenFromRequest(request);
        const payload = token ? await verifyToken(token) : null;

        if (!payload) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Only allow users to see their own logs unless admin
        const { searchParams } = new URL(request.url);
        const queryUserId = parseInt(searchParams.get('userId'));

        if (payload.role !== 'admin' && queryUserId !== payload.userId) {
            return NextResponse.json({ error: 'Prohibido' }, { status: 403 });
        }

        const { auditService } = await import('@/server/modules/audit/audit.service');
        const logs = await auditService.getUserLogs(queryUserId);
        
        return NextResponse.json({ success: true, logs });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
