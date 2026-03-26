import db from '@/lib/db';

export const authRepository = {
    findUserByEmail(email) {
        return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    },

    findUserById(id) {
        return db.prepare('SELECT id, name, email, role, is_active FROM users WHERE id = ?').get(id);
    },

    createUser({ name, email, password }) {
        const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const result = stmt.run(name, email, password);
        return result.lastInsertRowid;
    },

    createAuditLog({ userId, event, detail, ipAddress }) {
        return db.prepare('INSERT INTO audit_logs (user_id, event, detail, ip_address) VALUES (?, ?, ?, ?)')
            .run(userId || null, event, detail, ipAddress);
    }
};
