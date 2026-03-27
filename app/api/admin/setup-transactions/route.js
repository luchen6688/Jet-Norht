import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                booking_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                currency TEXT DEFAULT 'USD',
                payment_method TEXT,
                status TEXT DEFAULT 'completado',
                provider_reference TEXT,
                created_at DATETIME DEFAULT (datetime('now', 'localtime')),
                FOREIGN KEY (booking_id) REFERENCES bookings(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        // Insert some dummy data if empty
        const count = db.prepare("SELECT COUNT(*) as count FROM transactions").get().count;
        if (count === 0) {
            const bookings = db.prepare("SELECT id, user_id FROM bookings LIMIT 5").all();
            const stmt = db.prepare("INSERT INTO transactions (booking_id, user_id, amount, payment_method, provider_reference) VALUES (?, ?, ?, ?, ?)");
            bookings.forEach(b => {
                stmt.run(b.id, b.user_id, 450.00, 'Tarjeta de Crédito', 'txn_' + Math.random().toString(36).substr(2, 9));
            });
        }

        return NextResponse.json({ success: true, message: 'Table transactions created and seeded.' });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
