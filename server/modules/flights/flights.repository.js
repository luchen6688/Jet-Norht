import db from '@/lib/db';

export const flightRepository = {
    findFlights({ origin, destination, date }) {
        let query = `
            SELECT f.*, r.flight_number, r.origin, r.destination, 
                   r.scheduled_departure_time, r.scheduled_arrival_time,
                   ao.city AS origin_city, ao.name AS origin_name,
                   ad.city AS destination_city, ad.name AS destination_name
            FROM flights f
            JOIN routes r ON f.route_id = r.id
            LEFT JOIN airports ao ON r.origin = ao.code
            LEFT JOIN airports ad ON r.destination = ad.code
        `;
        const params = [];
        const conditions = [];

        if (origin) {
            conditions.push('r.origin = ?');
            params.push(origin);
        }
        if (destination) {
            conditions.push('r.destination = ?');
            params.push(destination);
        }
        if (date) {
            conditions.push('f.date = ?');
            params.push(date);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        return db.prepare(query).all(...params);
    },

    findById(id) {
        return db.prepare(`
            SELECT f.*, r.flight_number, r.origin, r.destination, 
                   r.scheduled_departure_time, r.scheduled_arrival_time,
                   ao.city AS origin_city, ao.name AS origin_name,
                   ad.city AS destination_city, ad.name AS destination_name
            FROM flights f
            JOIN routes r ON f.route_id = r.id
            LEFT JOIN airports ao ON r.origin = ao.code
            LEFT JOIN airports ad ON r.destination = ad.code
            WHERE f.id = ?
        `).get(id);
    },

    updateGate(id, gate) {
        return db.prepare('UPDATE flights SET gate = ? WHERE id = ?').run(gate, id);
    }
};
