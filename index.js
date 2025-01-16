const express = require('express');
const app = express();
const PORT = 3000;

// Databaseconfiguratie
const db = require('./db/knex');

db.schema.hasTable('users').then((exists) => {
  if (!exists) {
    return db.schema.createTable('users', (table) => {
      table.increments('id'); 
      table.string('name').notNullable(); 
      table.string('email').notNullable(); 
      table.timestamps(true, true); 
    });
  }
}).then(() => {
  console.log('Database en tabel "users" zijn klaar.');
}).catch((err) => {
  console.error('Database fout:', err);
});

// Middleware
app.use(express.json());

// Routes
app.get('/a', (req, res) => {
  res.send('Welkom bij de Basic Fit API!');
});

// Start de server
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
