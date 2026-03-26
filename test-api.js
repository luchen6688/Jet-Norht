fetch('http://localhost:3000/api/airports').then(r => r.json()).then(console.log).catch(console.error);
