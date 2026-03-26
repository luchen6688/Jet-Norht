export class AirportDTO {
    constructor({ code, city, name }) {
        this.code = code;
        this.city = city;
        this.name = name;
    }

    validate() {
        if (!this.code || !this.city || !this.name) {
            throw new Error('Todos los campos son obligatorios.');
        }
    }
}
