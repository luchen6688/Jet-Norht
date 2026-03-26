import { NextResponse } from 'next/server';
import { airportService } from './airports.service';

export const airportController = {
    async list() {
        try {
            const airports = await airportService.getAllAirports();
            return NextResponse.json({ success: true, airports });
        } catch (error) {
            console.error("Airport controller error:", error);
            return NextResponse.json({ error: 'Failed to fetch airports' }, { status: 500 });
        }
    }
};
