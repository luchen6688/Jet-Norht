import Database from 'better-sqlite3';
import path from 'path';

// Import modular schemas
import { initUsuarioSchema } from '@/server/modules/usuario/usuario.schema';
import { initFlightsSchema } from '@/server/modules/flights/flights.schema';
import { initBookingsSchema } from '@/server/modules/bookings/bookings.schema';
import { initAuditSchema } from '@/server/modules/audit/audit.schema';
import { initTransactionsSchema } from '@/server/modules/transactions/transactions.schema';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Configuration
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database tables via modules
export function initDB() {
    console.log('Initializing Modular Database...');
    
    initUsuarioSchema(db);
    initFlightsSchema(db);
    initBookingsSchema(db);
    initAuditSchema(db);
    initTransactionsSchema(db);
    
    console.log('Database Initialization Complete.');
}

// Run initialization immediately on import
initDB();

export default db;
