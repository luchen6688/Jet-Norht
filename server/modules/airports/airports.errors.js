export class AirportError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
        this.name = 'AirportError';
    }
}
