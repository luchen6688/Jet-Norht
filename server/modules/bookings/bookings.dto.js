export class CreateBookingDTO {
    constructor({ flightId, passengerName }) {
        this.flightId = flightId;
        this.passengerName = passengerName?.trim();
    }

    validate() {
        if (!this.flightId || !this.passengerName) {
            throw new Error('Vuelo y nombre del pasajero son obligatorios.');
        }
    }
}

export class UpdateBookingDTO {
    constructor({ action }) {
        this.action = action;
    }

    validate() {
        if (!this.action || !['cancel', 'checkin', 'pay'].includes(this.action)) {
            throw new Error('Acción no válida. Usa: cancel, checkin, pay.');
        }
    }
}
