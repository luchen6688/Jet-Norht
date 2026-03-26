const Database = require('better-sqlite3');
const path = require('path');

async function testBackend() {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    const db = new Database(dbPath);

    console.log('--- Testing Backend Logic ---');

    // 1. Find a test user and flight
    const user = db.prepare('SELECT id FROM users LIMIT 1').get();
    const flight = db.prepare('SELECT id FROM flights LIMIT 1').get();

    if (!user || !flight) {
        console.log('Need a user and a flight to test. Run seeding first.');
        return;
    }

    // 2. Create a booking
    const ref = 'TEST' + Math.floor(Math.random() * 100);
    const bookingResult = db.prepare(`
        INSERT INTO bookings (user_id, flight_id, passenger_name, booking_reference, status)
        VALUES (?, ?, 'Test Pasajero', ?, 'Esperando pago')
    `).run(user.id, flight.id, ref);
    const bookingId = bookingResult.lastInsertRowid;
    console.log(`Created booking ID: ${bookingId} Reference: ${ref}`);

    // Simulate API logic for PATCH /api/bookings/[id]
    const patchAction = (id, action) => {
        const booking = db.prepare('SELECT b.*, f.date, f.departure_time FROM bookings b JOIN flights f ON b.flight_id = f.id WHERE b.id = ?').get(id);
        if (!booking) return { error: 'Not found' };
        
        if (action === 'pay') {
            db.prepare("UPDATE bookings SET status = 'Confirmado' WHERE id = ?").run(id);
            return { success: true, status: 'Confirmado' };
        }
        if (action === 'cancel') {
            db.prepare("UPDATE bookings SET status = 'Cancelado' WHERE id = ?").run(id);
            return { success: true, status: 'Cancelado' };
        }
        if (action === 'checkin') {
            // Simple checkin logic test
            db.prepare("UPDATE bookings SET status = 'Check-in completado' WHERE id = ?").run(id);
            return { success: true, status: 'Check-in completado' };
        }
    };

    // Test Pay
    console.log('Testing action: pay...');
    const payRes = patchAction(bookingId, 'pay');
    console.log('Pay Result:', payRes);

    // Test Checkin
    console.log('Testing action: checkin...');
    const checkinRes = patchAction(bookingId, 'checkin');
    console.log('Checkin Result:', checkinRes);

    // Test Cancel
    console.log('Creating another booking for cancel test...');
    const ref2 = 'CNCL' + Math.floor(Math.random() * 100);
    const booking2Id = db.prepare(`
        INSERT INTO bookings (user_id, flight_id, passenger_name, booking_reference, status)
        VALUES (?, ?, 'Cancel Tester', ?, 'Esperando pago')
    `).run(user.id, flight.id, ref2).lastInsertRowid;

    console.log('Testing action: cancel...');
    const cancelRes = patchAction(booking2Id, 'cancel');
    console.log('Cancel Result:', cancelRes);

    const finals = db.prepare('SELECT id, status FROM bookings WHERE id IN (?, ?)').all(bookingId, booking2Id);
    console.log('\nFinal Statuses in DB:');
    console.log(finals);

    db.close();
}

testBackend();
