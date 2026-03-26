import { flightRepository } from './flights.repository';

export const flightService = {
    async searchFlights(filters) {
        return flightRepository.findFlights(filters);
    },

    async getFlightById(id) {
        return flightRepository.findById(id);
    }
};
