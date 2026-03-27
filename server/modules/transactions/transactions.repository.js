import db from '@/lib/db';

export const transactionsRepository = {
    findAll(limit = 100) {
        return db.prepare(`
            SELECT t.*, u.name as user_name, b.booking_reference 
            FROM transactions t
            LEFT JOIN users u ON t.user_id = u.id
            LEFT JOIN bookings b ON t.booking_id = b.id
            ORDER BY t.created_at DESC
            LIMIT ?
        `).all(limit);
    },

    getStats() {
        return db.prepare(`
            SELECT 
                SUM(CASE WHEN date(created_at) = date('now') THEN amount ELSE 0 END) as revenue_today,
                COUNT(id) as total_transactions,
                SUM(amount) as total_revenue
            FROM transactions
        `).get();
    }
};
