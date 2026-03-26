import { flightController } from '@/server/modules/flights/flights.controller';

export async function GET(request) {
    return flightController.searchFlights(request);
}
