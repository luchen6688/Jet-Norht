import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

try {
    const dbPath = path.join('C:/Users/luche/.gemini/antigravity/scratch/jetblue-clone', 'database.sqlite');
    console.log('Opening DB at:', dbPath);
    const db = new Database(dbPath);
    console.log('DB opened successfully');
    
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables:', JSON.stringify(tables));
    
    try {
        const airports = db.prepare('SELECT COUNT(*) as c FROM airports').get();
        console.log('Airports count:', airports.c);
    } catch(e) { console.log('airports table error:', e.message); }

    try {
        const flights = db.prepare('SELECT COUNT(*) as c FROM flights').get();
        console.log('Flights count:', flights.c);
    } catch(e) { console.log('flights table error:', e.message); }

    try {
        const routes = db.prepare('SELECT COUNT(*) as c FROM routes').get();
        console.log('Routes count:', routes.c);
    } catch(e) { console.log('routes table error:', e.message); }

    try {
        const users = db.prepare('SELECT COUNT(*) as c FROM users').get();
        console.log('Users count:', users.c);
    } catch(e) { console.log('users table error:', e.message); }

    try {
        const bookings = db.prepare('SELECT COUNT(*) as c FROM bookings').get();
        console.log('Bookings count:', bookings.c);
    } catch(e) { console.log('bookings table error:', e.message); }

    db.close();
} catch(e) {
    console.error('Top-level error:', e.message);
    console.error(e.stack);
}
