import { NextResponse } from 'next/server';
import { transactionsRepository } from '@/server/modules/transactions/transactions.repository';

export async function GET() {
    try {
        const transactions = transactionsRepository.findAll(100);
        return NextResponse.json(transactions);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
