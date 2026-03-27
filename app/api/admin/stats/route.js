import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { transactionsRepository } from '@/server/modules/transactions/transactions.repository';

export async function GET() {
    try {
        // Stats from transactions
        const transStats = transactionsRepository.getStats() || { revenue_today: 0, total_revenue: 0 };
        
        // Stats from bookings
        const bookingStats = db.prepare(`
            SELECT 
                COUNT(*) as total_bookings,
                SUM(CASE WHEN date(created_at) = date('now') THEN 1 ELSE 0 END) as bookings_today
            FROM bookings
        `).get();

        // Stats from flights
        const flightStats = db.prepare(`
            SELECT COUNT(*) as active_flights FROM flights WHERE status = 'En horario' OR status = 'Abordando'
        `).get();

        // Stats from users
        const userStats = db.prepare(`
            SELECT COUNT(*) as total_users FROM users
        `).get();

        // System alerts (mocked for now based on audit logs)
        const alerts = db.prepare(`
            SELECT COUNT(*) as alert_count FROM audit_logs WHERE event LIKE '%error%' OR event LIKE '%fail%'
        `).get();

        return NextResponse.json({
            revenue_today: transStats.revenue_today || 0,
            bookings_today: bookingStats.bookings_today || 0,
            active_flights: flightStats.active_flights || 0,
            system_alerts: alerts.alert_count || 0,
            total_revenue: transStats.total_revenue || 0,
            total_bookings: bookingStats.total_bookings || 0,
            total_users: userStats.total_users || 0
        });
    } catch (err) {
        console.error('Stats API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
