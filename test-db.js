import db from './lib/db.js';
console.log('DB loaded successfully!');
const airports = db.prepare('SELECT * FROM airports').all();
console.log('Airports count:', airports.length);
