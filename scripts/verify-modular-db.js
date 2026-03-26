const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

console.log('Verifying Database Structure...');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);
const expectedTables = ['users', 'airports', 'routes', 'flights', 'bookings', 'audit_logs'];

expectedTables.forEach(table => {
    if (tables.includes(table)) {
        console.log(`[OK] Table '${table}' exists.`);
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get().count;
        console.log(`     Rows: ${count}`);
    } else {
        console.log(`[ERROR] Table '${table}' is missing!`);
    }
});

db.close();
