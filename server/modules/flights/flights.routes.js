import { flightController } from './flights.controller';

export const flightRoutes = {
    search: (req) => flightController.searchFlights(req),
    get: (id) => flightController.getFlight(id)
};
