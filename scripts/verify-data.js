const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

const bookings = db.prepare(`
    SELECT b.*, r.origin, r.destination 
    FROM bookings b 
    JOIN flights f ON b.flight_id = f.id 
    JOIN routes r ON f.route_id = r.id 
    ORDER BY b.created_at DESC LIMIT 5
`).all();
console.log('Recent Bookings:');
console.log(JSON.stringify(bookings, null, 2));

const users = db.prepare('SELECT id, name, email FROM users ORDER BY created_at DESC LIMIT 5').all();
console.log('\nRecent Users:');
console.log(JSON.stringify(users, null, 2));

db.close();
