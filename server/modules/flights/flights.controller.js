import { NextResponse } from 'next/server';
import { flightService } from './flights.service';
import { SearchFlightDTO } from './flights.dto';

export const flightController = {
    async searchFlights(request) {
        try {
            const { searchParams } = new URL(request.url);
            const filters = {
                origin: searchParams.get('origin'),
                destination: searchParams.get('destination'),
                date: searchParams.get('date')
            };

            const dto = new SearchFlightDTO(filters);
            dto.validate();

            const flights = await flightService.searchFlights({
                origin: dto.origin,
                destination: dto.destination,
                date: dto.date
            });
            
            return NextResponse.json({ success: true, flights });
        } catch (error) {
            console.error('Search flights error:', error);
            return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
        }
    },

    async getFlight(id) {
        try {
            const flight = await flightService.getFlightById(id);
            if (!flight) {
                return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
            }
            return NextResponse.json({ success: true, flight });
        } catch (error) {
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
    }
};
