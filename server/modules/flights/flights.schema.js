/**
 * Flights Module Schema
 */
export function initFlightsSchema(db) {
    // Drop existing tables to apply normalization
    db.exec(`
    CREATE TABLE IF NOT EXISTS airports (
      code TEXT PRIMARY KEY,
      city TEXT NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flight_number TEXT NOT NULL UNIQUE,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      scheduled_departure_time TEXT NOT NULL,
      scheduled_arrival_time TEXT NOT NULL,
      FOREIGN KEY (origin) REFERENCES airports (code),
      FOREIGN KEY (destination) REFERENCES airports (code)
    );
    
    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      route_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      price INTEGER NOT NULL,
      gate TEXT,
      FOREIGN KEY (route_id) REFERENCES routes (id)
    );
    `);

    // Seed data for airports
    const insertAirport = db.prepare('INSERT OR IGNORE INTO airports (code, city, name) VALUES (?, ?, ?)');
    insertAirport.run('JFK', 'Nueva York', 'John F. Kennedy Intl');
    insertAirport.run('MIA', 'Miami', 'Miami Intl');
    insertAirport.run('CUN', 'Cancún', 'Cancún Intl');
    insertAirport.run('MAD', 'Madrid', 'Adolfo Suárez Madrid-Barajas');
    insertAirport.run('PAP', 'Puerto Príncipe', 'Toussaint Intl');
    insertAirport.run('BOG', 'Bogotá', 'El Dorado Intl');
    insertAirport.run('SDQ', 'Santo Domingo', 'Las Américas Intl');
    insertAirport.run('MEX', 'Ciudad de México', 'Benito Juárez Intl');
    insertAirport.run('LHR', 'Londres', 'Heathrow');
    insertAirport.run('PUJ', 'Punta Cana', 'Punta Cana Intl');
    insertAirport.run('SFO', 'San Francisco', 'San Francisco Intl');
    insertAirport.run('LAX', 'Los Angeles', 'Los Angeles Intl');

    // Seed data for routes and flights if none exist
    const routeCount = db.prepare('SELECT COUNT(*) as count FROM routes').get();
    if (routeCount.count === 0) {
        const insertRoute = db.prepare(`
            INSERT INTO routes (flight_number, origin, destination, scheduled_departure_time, scheduled_arrival_time)
            VALUES (?, ?, ?, ?, ?)
        `);
        
        const insertFlight = db.prepare(`
            INSERT INTO flights (route_id, date, price, gate) 
            VALUES (?, ?, ?, ?)
        `);

        const routeSpecs = [
            { fn: 'B6101', o: 'JFK', d: 'MIA', dep: '08:00', arr: '11:00', basePrice: 150 },
            { fn: 'B6102', o: 'MIA', d: 'JFK', dep: '13:00', arr: '16:00', basePrice: 150 },
            { fn: 'B6201', o: 'MIA', d: 'PAP', dep: '10:00', arr: '12:00', basePrice: 200 },
            { fn: 'B6202', o: 'PAP', d: 'MIA', dep: '14:00', arr: '16:00', basePrice: 220 },
            { fn: 'B6301', o: 'JFK', d: 'MAD', dep: '19:00', arr: '08:00', basePrice: 450 },
            { fn: 'B6302', o: 'MAD', d: 'JFK', dep: '11:00', arr: '14:30', basePrice: 500 },
            { fn: 'B6401', o: 'MIA', d: 'CUN', dep: '09:00', arr: '10:30', basePrice: 120 },
            { fn: 'B6402', o: 'CUN', d: 'MIA', dep: '12:00', arr: '14:30', basePrice: 130 },
            { fn: 'B6501', o: 'JFK', d: 'SDQ', dep: '07:30', arr: '11:30', basePrice: 280 },
            { fn: 'B6502', o: 'JFK', d: 'SDQ', dep: '14:00', arr: '18:00', basePrice: 320 },
            { fn: 'B6503', o: 'JFK', d: 'SDQ', dep: '22:30', arr: '02:30', basePrice: 250 },
            { fn: 'B6504', o: 'SDQ', d: 'JFK', dep: '13:30', arr: '17:30', basePrice: 290 },
            { fn: 'B6505', o: 'SDQ', d: 'JFK', dep: '06:00', arr: '10:00', basePrice: 310 },
            { fn: 'B6506', o: 'SDQ', d: 'JFK', dep: '19:45', arr: '23:45', basePrice: 260 },
            { fn: 'B6601', o: 'MIA', d: 'BOG', dep: '15:00', arr: '18:00', basePrice: 250 },
            { fn: 'B6602', o: 'BOG', d: 'MIA', dep: '08:00', arr: '11:00', basePrice: 240 },
            { fn: 'B6701', o: 'JFK', d: 'LHR', dep: '21:00', arr: '09:00', basePrice: 400 },
            { fn: 'B6702', o: 'LHR', d: 'JFK', dep: '12:00', arr: '15:30', basePrice: 450 },
            { fn: 'B6801', o: 'MIA', d: 'PUJ', dep: '10:30', arr: '13:00', basePrice: 180 },
            { fn: 'B6901', o: 'JFK', d: 'LAX', dep: '08:00', arr: '11:30', basePrice: 299 },
            { fn: 'B6902', o: 'LAX', d: 'JFK', dep: '13:00', arr: '21:30', basePrice: 310 },
            { fn: 'B61001', o: 'SFO', d: 'MIA', dep: '07:30', arr: '16:00', basePrice: 350 },
            { fn: 'B61101', o: 'SDQ', d: 'MAD', dep: '18:00', arr: '08:00', basePrice: 400 },
            { fn: 'B61102', o: 'MAD', d: 'SDQ', dep: '10:00', arr: '14:00', basePrice: 420 },
            { fn: 'B61201', o: 'SDQ', d: 'BOG', dep: '09:00', arr: '11:30', basePrice: 180 },
            { fn: 'B61202', o: 'BOG', d: 'SDQ', dep: '13:00', arr: '15:30', basePrice: 190 },
            { fn: 'B61301', o: 'SDQ', d: 'PAP', dep: '10:00', arr: '10:45', basePrice: 90 },
            { fn: 'B61302', o: 'PAP', d: 'SDQ', dep: '15:00', arr: '15:45', basePrice: 95 },
            { fn: 'B61401', o: 'SDQ', d: 'MEX', dep: '07:00', arr: '10:30', basePrice: 250 },
            { fn: 'B61402', o: 'MEX', d: 'SDQ', dep: '12:00', arr: '17:30', basePrice: 260 },
            { fn: 'B61501', o: 'SDQ', d: 'LHR', dep: '22:00', arr: '11:00', basePrice: 500 },
            { fn: 'B61502', o: 'LHR', d: 'SDQ', dep: '13:00', arr: '18:00', basePrice: 520 },
            { fn: 'B61601', o: 'SDQ', d: 'MIA', dep: '08:30', arr: '10:45', basePrice: 160 }
        ];

        const today = new Date();
        const gates = ['A1', 'A5', 'B12', 'B3', 'C8', 'D2'];

        for (const spec of routeSpecs) {
            const routeResult = insertRoute.run(spec.fn, spec.o, spec.d, spec.dep, spec.arr);
            const routeId = routeResult.lastInsertRowid;

            for (let i = 0; i <= 31; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() + i);
                const dateString = d.toISOString().split('T')[0];
                const priceVariance = Math.floor(Math.random() * 50) - 25;
                const gate = gates[Math.floor(Math.random() * gates.length)];
                
                insertFlight.run(routeId, dateString, spec.basePrice + priceVariance, gate);
            }
        }
    }
}
