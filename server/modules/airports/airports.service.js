import { airportRepository } from './airports.repository';

export const airportService = {
    async getAllAirports() {
        return airportRepository.findAll();
    },

    async getAirportByCode(code) {
        return airportRepository.findByCode(code);
    }
};
