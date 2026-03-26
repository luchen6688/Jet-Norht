export class BookingError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
        this.name = 'BookingError';
    }
}

export class BookingNotFoundError extends BookingError {
    constructor(message = 'Reserva no encontrada.') {
        super(message, 404);
        this.name = 'BookingNotFoundError';
    }
}
