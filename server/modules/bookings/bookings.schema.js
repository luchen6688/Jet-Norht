/**
 * Bookings Module Schema
 */
export function initBookingsSchema(db) {
    // Drop existing table to apply normalization
    db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      flight_id INTEGER NOT NULL,
      passenger_name TEXT NOT NULL,
      booking_reference TEXT NOT NULL UNIQUE,
      status TEXT DEFAULT 'Esperando pago',
      seat_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (flight_id) REFERENCES flights (id)
    );
    `);
}
