const knex = require('knex');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './db/basicfit.sqlite',
  },
  useNullAsDefault: true,
});

module.exports = db;
