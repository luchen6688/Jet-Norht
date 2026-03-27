import { NextResponse } from 'next/server';
import { auditRepository } from '@/server/modules/audit/audit.repository';

export async function GET() {
    try {
        const logs = auditRepository.findAll(100);
        return NextResponse.json(logs);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
