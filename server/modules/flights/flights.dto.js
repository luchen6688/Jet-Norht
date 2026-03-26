export class SearchFlightDTO {
    constructor({ origin, destination, date }) {
        this.origin = origin;
        this.destination = destination;
        this.date = date;
    }

    validate() {
        // Validation logic if needed
    }
}
