require('dotenv').config();

module.exports = {
  client: process.env.DB_CLIENT || 'sqlite3',
  connection: process.env.DB_CLIENT === 'sqlite3'
    ? { filename: process.env.SQLITE_FILENAME || './src/config/db/dev.sqlite3' }
    : process.env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    directory: './src/config/db/migrations',
  },
  seeds: {
    directory: './src/config/db/seeders',
  },
};
