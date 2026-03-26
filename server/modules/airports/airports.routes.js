import { airportController } from './airports.controller';

export const airportRoutes = {
    list: () => airportController.list()
};
