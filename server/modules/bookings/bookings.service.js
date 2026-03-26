import { bookingRepository } from './bookings.repository';
import { BookingNotFoundError } from './bookings.errors';
import db from '@/lib/db';

export const bookingService = {
    async createBooking({ userId, flightId, passengerName }) {
        const flight = db.prepare('SELECT id FROM flights WHERE id = ?').get(flightId);
        if (!flight) throw new Error('El vuelo seleccionado no existe.');

        let bookingReference;
        let attempts = 0;
        do {
            bookingReference = Math.random().toString(36).substring(2, 8).toUpperCase();
            if (!bookingRepository.isReferenceExists(bookingReference)) break;
            attempts++;
        } while (attempts < 10);

        const result = bookingRepository.create({ userId, flightId, passengerName, bookingReference });
        
        // Audit log
        if (userId) {
            import('@/server/modules/audit/audit.repository').then(({ auditRepository }) => {
                auditRepository.create({
                    userId,
                    event: 'BOOKING_CREATED',
                    detail: `Reserva ${bookingReference} para vuelo ${flightId}`
                });
            });
            
            // Send reservation email
            import('@/server/modules/usuario/usuario.repository').then(({ userRepository }) => {
                const user = userRepository.findById(userId);
                if (user && user.email) {
                    const flightDetails = db.prepare(`
                        SELECT f.date, r.flight_number, r.scheduled_departure_time, r.origin, r.destination, 
                               ao.city as origin_city, ad.city as destination_city
                        FROM flights f
                        JOIN routes r ON f.route_id = r.id
                        LEFT JOIN airports ao ON r.origin = ao.code
                        LEFT JOIN airports ad ON r.destination = ad.code
                        WHERE f.id = ?
                    `).get(flightId);
                    
                    if (flightDetails) {
                        import('@/server/modules/notifications/email.service').then(({ emailService }) => {
                            emailService.sendBookingConfirmation(user.email, {
                                passengerName,
                                bookingReference,
                                flightNumber: flightDetails.flight_number,
                                origin: flightDetails.origin_city || flightDetails.origin,
                                destination: flightDetails.destination_city || flightDetails.destination,
                                date: flightDetails.date,
                                departureTime: flightDetails.scheduled_departure_time,
                                status: 'Esperando pago'
                            }).catch(err => console.error('Error email reserva:', err));
                        });
                    }
                }
            }).catch(err => console.error('Error fetching user info for email:', err));
        }

        return {
            id: result.lastInsertRowid,
            bookingReference,
            status: 'Esperando pago'
        };
    },

    async getUserBookings(userId) {
        return bookingRepository.findByUser(userId);
    },

    async searchByReference(reference, lastName) {
        return bookingRepository.findByReferenceAndLastName(reference, lastName);
    },

    async getBookingById(id) {
        const booking = bookingRepository.findById(id);
        if (!booking) throw new BookingNotFoundError();
        return booking;
    },

    async updateBookingStatus(id, action, userId = null) {
        const booking = await this.getBookingById(id);

        if (userId && booking.user_id && booking.user_id !== userId) {
            throw new Error('No tienes permiso para modificar esta reserva.');
        }

        let newStatus;
        let logEvent;

        if (action === 'cancel') {
            if (booking.status === 'Cancelado') throw new Error('Esta reserva ya está cancelada.');
            newStatus = 'Cancelado';
            logEvent = 'BOOKING_CANCELLED';
            bookingRepository.updateStatus(id, newStatus);
        } else if (action === 'pay') {
            if (booking.status !== 'Esperando pago') throw new Error('Esta reserva no está pendiente de pago.');
            newStatus = 'Confirmado';
            logEvent = 'BOOKING_PAID';
            bookingRepository.updateStatus(id, newStatus);
            
            // Send confirmation email
            if (userId || booking.user_id) {
                const targetUserId = userId || booking.user_id;
                import('@/server/modules/usuario/usuario.repository').then(({ userRepository }) => {
                    const user = userRepository.findById(targetUserId);
                    if (user && user.email) {
                        import('@/server/modules/notifications/email.service').then(({ emailService }) => {
                            emailService.sendBookingConfirmation(user.email, {
                                passengerName: booking.passenger_name,
                                bookingReference: booking.booking_reference,
                                flightNumber: booking.flight_number,
                                origin: booking.origin_city || booking.origin,
                                destination: booking.destination_city || booking.destination,
                                date: booking.date,
                                departureTime: booking.scheduled_departure_time,
                                status: newStatus
                            }).catch(err => console.error('Error in background email:', err));
                        });
                    }
                }).catch(err => console.error('Error fetching user for email:', err));
            }
        } else if (action === 'checkin') {
            if (booking.status === 'Cancelado') throw new Error('No se puede hacer check-in en una reserva cancelada.');
            if (booking.status === 'Check-in completado') throw new Error('El check-in ya fue completado.');

            const flightDateTime = new Date(`${booking.date}T${booking.scheduled_departure_time}`);
            const now = new Date();
            const hoursUntilFlight = (flightDateTime - now) / (1000 * 60 * 60);

            if (hoursUntilFlight > 24) throw new Error(`El check-in abre 24 horas antes.`);
            if (hoursUntilFlight < 0) throw new Error('El vuelo ya ha partido.');

            newStatus = 'Check-in completado';
            logEvent = 'CHECKIN_COMPLETED';
            const seat = `${Math.floor(Math.random() * 30) + 1}${['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)]}`;

            bookingRepository.updateCheckIn(id, { status: newStatus, seat });
        }

        if (userId && logEvent) {
            import('@/server/modules/audit/audit.repository').then(({ auditRepository }) => {
                auditRepository.create({
                    userId,
                    event: logEvent,
                    detail: `Reserva ${booking.booking_reference}`
                });
            });
        }

        return { id, status: newStatus || booking.status };
    }
};
