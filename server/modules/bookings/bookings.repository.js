import db from '@/lib/db';

export const bookingRepository = {
    findById(id) {
        return db.prepare(`
            SELECT b.*, f.date, f.gate, f.price,
                   r.flight_number, r.scheduled_departure_time, r.scheduled_arrival_time,
                   r.origin, r.destination,
                   ao.city AS origin_city, ao.name AS origin_name,
                   ad.city AS destination_city, ad.name AS destination_name
            FROM bookings b
            JOIN flights f ON b.flight_id = f.id
            JOIN routes r ON f.route_id = r.id
            LEFT JOIN airports ao ON r.origin = ao.code
            LEFT JOIN airports ad ON r.destination = ad.code
            WHERE b.id = ?
        `).get(id);
    },

    findByReferenceAndLastName(reference, lastName) {
        return db.prepare(`
            SELECT b.*, f.date, f.gate, f.price,
                   r.flight_number, r.scheduled_departure_time, r.scheduled_arrival_time,
                   r.origin, r.destination,
                   ao.city AS origin_city, ad.city AS destination_city
            FROM bookings b
            JOIN flights f ON b.flight_id = f.id
            JOIN routes r ON f.route_id = r.id
            LEFT JOIN airports ao ON r.origin = ao.code
            LEFT JOIN airports ad ON r.destination = ad.code
            WHERE b.booking_reference = ? AND b.passenger_name LIKE ?
            ORDER BY b.created_at DESC
        `).all(reference.toUpperCase(), `%${lastName}%`);
    },

    findByUser(userId) {
        return db.prepare(`
            SELECT b.*, f.date, f.gate, f.price,
                   r.flight_number, r.scheduled_departure_time, r.scheduled_arrival_time,
                   r.origin, r.destination,
                   ao.city AS origin_city, ad.city AS destination_city
            FROM bookings b
            JOIN flights f ON b.flight_id = f.id
            JOIN routes r ON f.route_id = r.id
            LEFT JOIN airports ao ON r.origin = ao.code
            LEFT JOIN airports ad ON r.destination = ad.code
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `).all(userId);
    },

    create({ userId, flightId, passengerName, bookingReference }) {
        return db.prepare(`
            INSERT INTO bookings (user_id, flight_id, passenger_name, booking_reference, status)
            VALUES (?, ?, ?, ?, 'Esperando pago')
        `).run(userId, flightId, passengerName, bookingReference);
    },

    updateStatus(id, status) {
        return db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
    },

    updateCheckIn(id, { status, seat }) {
        return db.prepare('UPDATE bookings SET status = ?, seat_number = ? WHERE id = ?')
            .run(status, seat, id);
    },

    isReferenceExists(reference) {
        return db.prepare('SELECT id FROM bookings WHERE booking_reference = ?').get(reference);
    }
};
