import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  client: process.env.DB_CLIENT || 'sqlite3',
  connection:
    process.env.DB_CLIENT === 'sqlite3'
      ? { filename: process.env.SQLITE_FILENAME || './src/config/db/dev.sqlite3' }
      : process.env.DATABASE_URL,
  useNullAsDefault: true,
};

const db = knex(config);

export default db;
