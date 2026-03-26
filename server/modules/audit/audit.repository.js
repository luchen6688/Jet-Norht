import db from '@/lib/db';

export const auditRepository = {
    create({ userId, event, detail, ipAddress }) {
        return db.prepare('INSERT INTO audit_logs (user_id, event, detail, ip_address) VALUES (?, ?, ?, ?)')
            .run(userId || null, event, detail, ipAddress);
    },

    findAll(limit = 100) {
        return db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?').all(limit);
    },

    findByUser(userId) {
        return db.prepare('SELECT * FROM audit_logs WHERE user_id = ? ORDER BY created_at DESC').all(userId);
    }
};
