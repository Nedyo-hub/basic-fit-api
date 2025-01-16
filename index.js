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

// Validatiefuncties
const validateUser = (req, res, next) => {
  const { name, email, phone, start_date, end_date } = req.body;

  // Controleer of de velden niet leeg zijn
  if (!name || !email) {
    return res.status(400).json({ message: 'Naam en e-mailadres zijn verplicht.' });
  }

  // Controleer of de naam geen cijfers bevat
  if (/\d/.test(name)) {
    return res.status(400).json({ message: 'De naam mag geen cijfers bevatten.' });
  }

  // Controleer of het e-mailadres geldig is 
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Ongeldig e-mailadres.' });
  }

  // Controleer of het telefoonnummer geldig is 
  if (phone && !/^\+32 \d{3} \d{2} \d{2} \d{2}$/.test(phone)) {
    return res.status(400).json({ message: 'Ongeldig telefoonnummer. Gebruik het formaat: +32 444 44 44 44.' });
  }

  // Controleer of de einddatum na de startdatum valt
  if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({ message: 'De einddatum moet na de startdatum liggen.' });
  }

  next(); 
};

// Routes
// Haal alle gebruikers op met paginering en zoekfunctionaliteit
app.get('/users', (req, res) => {
  const { limit = 10, offset = 0, search = '' } = req.query; // Default limit = 10, offset = 0

  // Valideer dat de limit en offset getallen zijn
  if (isNaN(limit) || isNaN(offset)) {
    return res.status(400).json({ message: 'Limit en offset moeten getallen zijn.' });
  }

  const searchQuery = search.trim().toLowerCase();

  db('users')
    .select('*')
    .limit(parseInt(limit))
    .offset(parseInt(offset))
    .modify((queryBuilder) => {
      // Zoek naar gebruikers die de zoekterm bevatten in name of email
      if (searchQuery) {
        queryBuilder.where(function() {
          this.where('name', 'like', `%${searchQuery}%`)
            .orWhere('email', 'like', `%${searchQuery}%`);
        });
      }
    })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Fout bij ophalen van gebruikers', error: err });
    });
});

// Voeg een nieuwe gebruiker toe
app.post('/users', validateUser, (req, res) => {
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

// Haal gebruiker op met een bepaald id
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
app.put('/users/:id', validateUser, (req, res) => {
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

const path = require('path'); 
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'documentatie.html')); 
});


// Start de server
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
