import db from '@/lib/db';

export const airportRepository = {
    findAll() {
        return db.prepare('SELECT * FROM airports ORDER BY city ASC').all();
    },

    findByCode(code) {
        return db.prepare('SELECT * FROM airports WHERE code = ?').get(code);
    }
};
