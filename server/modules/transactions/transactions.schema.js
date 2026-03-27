/**
 * Transactions Module Schema
 */
export function initTransactionsSchema(db) {
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    `);
}
