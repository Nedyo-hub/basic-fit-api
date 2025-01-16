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
// Haal alle gebruikers op
app.get('/users', (req, res) => {
  db('users')
    .select('*')
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Fout bij ophalen van gebruikers', error: err });
    });
});

// Voeg nieuwe gebruiker toe
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  db('users')
    .insert({ name, email })
    .then(() => {
      res.status(201).json({ message: 'Gebruiker toegevoegd!' });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Fout bij toevoegen van gebruiker', error: err });
    });
});

// Haal gebruiker op met bepaald id
app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  db('users')
    .where('id', id)
    .first()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Gebruiker niet gevonden' });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Fout bij ophalen van gebruiker', error: err });
    });
});

// Werk gebruiker bij
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  db('users')
    .where('id', id)
    .update({ name, email })
    .then((count) => {
      if (count === 0) {
        return res.status(404).json({ message: 'Gebruiker niet gevonden' });
      }
      res.status(200).json({ message: 'Gebruiker bijgewerkt!' });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Fout bij bijwerken van gebruiker', error: err });
    });
});

// Verwijder gebruiker
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  db('users')
    .where('id', id)
    .del()
    .then((count) => {
      if (count === 0) {
        return res.status(404).json({ message: 'Gebruiker niet gevonden' });
      }
      res.status(200).json({ message: 'Gebruiker verwijderd!' });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Fout bij verwijderen van gebruiker', error: err });
    });
});

// Start de server
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
