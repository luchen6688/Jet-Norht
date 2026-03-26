import db from '@/lib/db';

export const userRepository = {
    findById(id) {
        return db.prepare('SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?').get(id);
    },

    findAll() {
        return db.prepare('SELECT id, name, email, role, is_active, created_at FROM users').all();
    },

    update(id, { name, email }) {
        let query = 'UPDATE users SET ';
        const params = [];
        const updates = [];

        if (name) {
            updates.push('name = ?');
            params.push(name);
        }
        if (email) {
            updates.push('email = ?');
            params.push(email);
        }

        if (updates.length === 0) return;

        query += updates.join(', ') + ' WHERE id = ?';
        params.push(id);

        return db.prepare(query).run(...params);
    },

    delete(id) {
        return db.prepare('DELETE FROM users WHERE id = ?').run(id);
    }
};
