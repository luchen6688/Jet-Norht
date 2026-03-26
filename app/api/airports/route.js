import { airportController } from '@/server/modules/airports/airports.controller';

export const dynamic = 'force-dynamic';

export async function GET() {
    return airportController.list();
}
