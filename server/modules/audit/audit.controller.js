import { NextResponse } from 'next/server';
import { auditService } from './audit.service';
import { CreateAuditDTO } from './audit.dto';

export const auditController = {
    async create(request) {
        try {
            const body = await request.json();
            const dto = new CreateAuditDTO(body);
            dto.validate();

            await auditService.logEvent({
                userId: dto.userId,
                event: dto.event,
                detail: dto.detail,
                ipAddress: dto.ipAddress
            });

            return NextResponse.json({ success: true, message: 'Log de auditoría creado' });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    },

    async getLogs(request) {
        try {
            const { searchParams } = new URL(request.url);
            const limit = parseInt(searchParams.get('limit') || '100');
            const logs = await auditService.getLogs(limit);
            return NextResponse.json({ success: true, logs });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
};
