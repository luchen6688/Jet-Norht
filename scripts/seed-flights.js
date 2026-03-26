const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

console.log('--- Seeding Flights ---');

// Get all airports
const airports = db.prepare('SELECT code FROM airports').all().map(a => a.code);

if (airports.length < 2) {
    console.error('Not enough airports to seed flights. Run db initialization first.');
    process.exit(1);
}

const insertFlight = db.prepare(`
    INSERT INTO flights (origin, destination, price, date, departure_time, arrival_time) 
    VALUES (?, ?, ?, ?, ?, ?)
`);

// Clear old flights (optional, but good for fresh data)
// db.prepare('DELETE FROM flights').run();

const baseRoutes = [
    { o: 'SDQ', d: 'MEX', price: 250, dep: '08:00', arr: '11:30' },
    { o: 'MEX', d: 'SDQ', price: 260, dep: '13:00', arr: '18:30' },
    { o: 'SDQ', d: 'MIA', price: 180, dep: '07:00', arr: '09:15' },
    { o: 'MIA', d: 'SDQ', price: 175, dep: '19:45', arr: '22:00' },
    { o: 'JFK', d: 'SDQ', price: 320, dep: '10:15', arr: '14:00' },
    { o: 'SDQ', d: 'JFK', price: 310, dep: '15:30', arr: '19:15' },
    { o: 'PUJ', d: 'MAD', price: 650, dep: '21:00', arr: '10:30' },
    { o: 'MAD', d: 'PUJ', price: 680, dep: '14:00', arr: '18:15' },
    { o: 'BOG', d: 'SDQ', price: 210, dep: '11:00', arr: '13:30' },
    { o: 'SDQ', d: 'BOG', price: 215, dep: '15:00', arr: '17:30' },
    { o: 'LAX', d: 'JFK', price: 299, dep: '08:00', arr: '16:30' },
    { o: 'JFK', d: 'LAX', price: 299, dep: '18:00', arr: '21:30' },
];

const today = new Date();
let count = 0;

// Seed for next 45 days
for (let i = 0; i <= 45; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateString = d.toISOString().split('T')[0];

    for (const route of baseRoutes) {
        // Only insert if not exists (simple check by origin, dest, date, dep_time)
        const exists = db.prepare('SELECT id FROM flights WHERE origin = ? AND destination = ? AND date = ? AND departure_time = ?')
            .get(route.o, route.d, dateString, route.dep);
        
        if (!exists) {
            const priceVariance = Math.floor(Math.random() * 60) - 30;
            insertFlight.run(route.o, route.d, route.price + priceVariance, dateString, route.dep, route.arr);
            count++;
        }
    }
}

console.log(`Seeded ${count} new flights.`);
db.close();
