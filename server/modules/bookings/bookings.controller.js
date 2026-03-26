import { NextResponse } from 'next/server';
import { bookingService } from './bookings.service';
import { CreateBookingDTO, UpdateBookingDTO } from './bookings.dto';

export const bookingController = {
    async create(request, userId) {
        try {
            const body = await request.json();
            const dto = new CreateBookingDTO(body);
            dto.validate();

            const booking = await bookingService.createBooking({
                userId,
                flightId: dto.flightId,
                passengerName: dto.passengerName
            });

            return NextResponse.json({
                success: true,
                message: 'Reserva creada con éxito',
                booking
            }, { status: 201 });
        } catch (error) {
            console.error('Booking creation error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    },

    async list(request, userId) {
        try {
            const { searchParams } = new URL(request.url);
            const reference = searchParams.get('reference');
            const lastName = searchParams.get('lastName');

            let bookings;
            if (userId) {
                bookings = await bookingService.getUserBookings(userId);
            } else if (reference && lastName) {
                bookings = await bookingService.searchByReference(reference, lastName);
            } else {
                return NextResponse.json({ error: 'Faltan parámetros de búsqueda.' }, { status: 400 });
            }

            return NextResponse.json({ bookings });
        } catch (error) {
            return NextResponse.json({ error: 'Error al obtener reservas.' }, { status: 500 });
        }
    },

    async getById(id) {
        try {
            const booking = await bookingService.getBookingById(id);
            return NextResponse.json({ booking });
        } catch (error) {
            const status = error.status || 500;
            return NextResponse.json({ error: error.message }, { status });
        }
    },

    async update(id, request, userId) {
        try {
            const body = await request.json();
            const dto = new UpdateBookingDTO(body);
            dto.validate();

            const result = await bookingService.updateBookingStatus(id, dto.action, userId);
            
            return NextResponse.json({
                success: true,
                message: `Reserva actualizada correctamente`,
                booking: result
            });
        } catch (error) {
            const status = error.status || 400;
            return NextResponse.json({ error: error.message }, { status });
        }
    }
};
